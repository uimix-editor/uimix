import {
  Image,
  ColorToken,
  NodeJSON,
  PageJSON,
  ProjectJSON,
  ProjectManifestJSON,
  StyleJSON,
} from "@uimix/model/src/data/v1";
import { getPageID, compareProjectJSONs } from "@uimix/model/src/data/util";
import { omit } from "lodash-es";
import { formatJSON } from "../format";
import { FileAccess } from "./FileAccess";
import * as path from "path";

interface HierarchicalNodeJSON extends NodeJSON {
  id: string;
  children: HierarchicalNodeJSON[];
}

function toHierarchicalNodeJSONs(
  nodes: Record<string, NodeJSON>
): HierarchicalNodeJSON[] {
  const hierarchicalNodes: Record<string, HierarchicalNodeJSON> = {};

  for (const [id, node] of Object.entries(nodes)) {
    hierarchicalNodes[id] = {
      ...node,
      id,
      children: [],
    };
  }

  for (const [id, node] of Object.entries(nodes)) {
    if (node.parent) {
      hierarchicalNodes[node.parent].children.push(hierarchicalNodes[id]);
    }
  }

  for (const node of Object.values(hierarchicalNodes)) {
    node.children.sort((a, b) => a.index - b.index);
  }

  return Object.values(hierarchicalNodes).filter((node) => !node.parent);
}

interface WorkspaceLoaderOptions {
  filePattern?: string;
}

// Important TODO: fix paths in Windows!!
export class WorkspaceLoader {
  static async load(
    fileAccess: FileAccess,
    options: WorkspaceLoaderOptions = {}
  ) {
    const loader = new WorkspaceLoader(fileAccess, options);
    await loader.load();
    return loader;
  }

  constructor(fileAccess: FileAccess, options: WorkspaceLoaderOptions = {}) {
    this.fileAccess = fileAccess;
    this.filePattern = options.filePattern ?? "**/*.uimix";
  }

  readonly fileAccess: FileAccess;

  get rootPath(): string {
    return this.fileAccess.rootPath;
  }

  readonly filePattern: string;
  readonly manifestName = "uimix.json";
  jsons = new Map<string, ProjectJSON>(); // project path -> project json

  get json(): ProjectJSON {
    return (
      this.jsons.get(this.rootPath) ?? {
        nodes: {},
        styles: {},
      }
    );
  }
  set json(json: ProjectJSON) {
    this.jsons.set(this.rootPath, json);
  }

  projectPathForFile(pagePath: string): string {
    return (
      [...this.jsons.keys()]
        .sort((a, b) => b.length - a.length)
        .find((projectPath) => pagePath.startsWith(projectPath + path.sep)) ??
      this.rootPath
    );
  }

  async load(): Promise<boolean> {
    const filePaths = await this.fileAccess.glob(
      `{${this.filePattern},**/${this.manifestName}}`
    );
    filePaths.sort();

    const filePathsForProject = new Map<string, string[]>([
      [this.rootPath, []],
    ]);

    for (const manifestPaths of filePaths.filter((filePath) =>
      filePath.endsWith(this.manifestName)
    )) {
      const parentPath = path.dirname(manifestPaths);
      filePathsForProject.set(parentPath, []);
    }

    for (const filePath of filePaths) {
      if (filePath.endsWith(this.manifestName)) {
        continue;
      }

      const projectPath = [...filePathsForProject.keys()]
        .sort((a, b) => b.length - a.length)
        .find((projectPath) => filePath.startsWith(projectPath + path.sep));
      if (!projectPath) {
        throw new Error("not supposed to happen");
      }
      filePathsForProject.get(projectPath)?.push(filePath);
    }

    let changed = false;

    for (const [projectPath, pagePaths] of filePathsForProject) {
      let manifest: ProjectManifestJSON;
      try {
        manifest = ProjectManifestJSON.parse(
          JSON.parse(
            await this.fileAccess.readText(
              path.join(projectPath, this.manifestName)
            )
          )
        );
      } catch {
        manifest = { componentURLs: [] };
      }

      const pages = new Map<string, PageJSON>();

      for (const pagePath of pagePaths) {
        const pageJSON = PageJSON.parse(
          JSON.parse(await this.fileAccess.readText(pagePath))
        );

        pages.set(
          path.relative(projectPath, pagePath).replace(/\.uimix$/, ""),
          pageJSON
        );
      }
      const newProjectJSON = filesToProjectJSON(manifest, pages);

      if (
        !compareProjectJSONs(
          this.jsons.get(projectPath) ?? { nodes: {}, styles: {} },
          newProjectJSON
        )
      ) {
        changed = true;
      }

      this.jsons.set(projectPath, newProjectJSON);
    }

    return changed;
  }

  async save(filePaths?: string[]): Promise<void> {
    const pagePathsToDelete = new Set(
      await this.fileAccess.glob(this.filePattern)
    );

    for (const [projectPath, json] of this.jsons) {
      const { manifest, pages } = projectJSONToFiles(json);

      await this.fileAccess.writeText(
        path.join(projectPath, this.manifestName),
        formatJSON(JSON.stringify(manifest))
      );

      for (const [pageName, pageJSON] of pages) {
        const pagePath = path.join(projectPath, pageName + ".uimix");
        if (filePaths && !filePaths.includes(pagePath)) {
          continue;
        }
        await this.fileAccess.writeText(
          pagePath,
          formatJSON(JSON.stringify(pageJSON))
        );
        pagePathsToDelete.delete(pagePath);
      }
    }

    for (const pagePath of pagePathsToDelete) {
      await this.fileAccess.remove(pagePath);
    }
  }

  watch(onChange: (projectJSON: ProjectJSON) => void): () => void {
    console.log("start watching...");

    return this.fileAccess.watch(this.filePattern, async () => {
      try {
        if (await this.load()) {
          onChange(this.json);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
}

export function projectJSONToFiles(projectJSON: ProjectJSON): {
  manifest: ProjectManifestJSON;
  pages: Map<string, PageJSON>;
} {
  const manifest: ProjectManifestJSON = {
    componentURLs: projectJSON.componentURLs,
  };

  const hierarchicalNodes = toHierarchicalNodeJSONs(projectJSON.nodes);
  const projectNode = hierarchicalNodes.find((node) => node.type === "project");
  if (!projectNode) {
    throw new Error("Project node not found");
  }

  const pages = new Map<string, PageJSON>();
  const nodeIDToPageJSON = new Map<string, PageJSON>();
  for (const page of projectNode.children) {
    if (page.type !== "page") {
      throw new Error("expected page node");
    }
    if (!page.name) {
      throw new Error("page name is empty");
    }

    const pageJSON: PageJSON = {
      nodes: {},
      styles: {},
      // TODO: selectively save images
      images: projectJSON.images,
      colors: Object.fromEntries(
        Object.entries(projectJSON.colors ?? {})
          .filter(([, color]) => color.page === page.id)
          .map(([id, color]) => [id, omit(color, ["page"])])
      ),
    };
    const addNodeRecursively = (node: HierarchicalNodeJSON) => {
      pageJSON.nodes[node.id] = omit(node, ["children", "id"]);
      nodeIDToPageJSON.set(node.id, pageJSON);
      for (const child of node.children) {
        addNodeRecursively(child);
      }
    };
    for (const child of page.children) {
      addNodeRecursively(omit(child, ["parent"]));
    }

    pages.set(page.name, pageJSON);
  }

  for (const [id, style] of Object.entries(projectJSON.styles)) {
    const idPath = id.split(":");
    const pageJSON = nodeIDToPageJSON.get(idPath[0]);
    if (pageJSON) {
      pageJSON.styles[id] = style;
    }
  }

  return {
    manifest,
    pages,
  };
}

export function filesToProjectJSON(
  manifest: ProjectManifestJSON,
  pages: Map<string, PageJSON>
): ProjectJSON {
  // TODO: detect ID conflicts between files (and provide way to resolve them)

  const nodes: Record<string, NodeJSON> = {};
  const styles: Record<string, Partial<StyleJSON>> = {};
  const images: Record<string, Image> = {};
  const colors: Record<string, ColorToken> = {};

  const projectNode: NodeJSON = {
    type: "project",
    index: 0,
  };
  nodes["project"] = projectNode;

  let pageIndex = 0;
  for (const [pageName, pageJSON] of pages) {
    const pageID: string = getPageID(pageName);

    const pageNode: NodeJSON = {
      type: "page",
      index: pageIndex++,
      name: pageName,
      parent: "project",
    };
    nodes[pageID] = pageNode;

    for (const [id, node] of Object.entries(pageJSON.nodes)) {
      nodes[id] = {
        ...node,
        parent: node.parent ?? pageID,
      };
    }

    for (const [id, style] of Object.entries(pageJSON.styles)) {
      styles[id] = style;
    }
    for (const [id, image] of Object.entries(pageJSON.images ?? {})) {
      images[id] = image;
    }
    for (const [id, color] of Object.entries(pageJSON.colors ?? {})) {
      colors[id] = {
        ...color,
        page: pageID,
      };
    }
  }

  return {
    nodes,
    styles,
    componentURLs: manifest.componentURLs,
    images,
    colors,
  };
}
