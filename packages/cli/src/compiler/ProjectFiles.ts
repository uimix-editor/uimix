import {
  Image,
  ColorToken,
  NodeJSON,
  PageJSON,
  ProjectJSON,
  ProjectManifestJSON,
  StyleJSON,
} from "@uimix/node-data";
import {
  getPageID,
  compareProjectJSONs,
} from "@uimix/editor/src/models/ProjectJSON";
import { omit } from "lodash-es";
import { mkdirpSync } from "mkdirp";
import { globSync } from "glob";
import path from "path";
import fs from "fs";
import { formatJSON } from "../format";
import chokidar from "chokidar";

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

interface ProjectFilesOptions {
  filePattern?: string;
}

// Important TODO: fix paths in Windows!!
export class ProjectFiles {
  static load(rootPath: string, options: ProjectFilesOptions = {}) {
    const projectFiles = new ProjectFiles(rootPath, options);
    projectFiles.load();
    return projectFiles;
  }

  constructor(rootPath: string, options: ProjectFilesOptions = {}) {
    this.rootPath = rootPath;
    this.filePattern = options.filePattern ?? "**/*.uimix";
  }

  readonly rootPath: string;
  readonly filePattern: string;
  readonly manifestName = "uimix.json";
  json: ProjectJSON = {
    nodes: {},
    styles: {},
  };

  load(): boolean {
    const rootPath = this.rootPath;
    const manifestPath = path.resolve(rootPath, this.manifestName);
    let manifest: ProjectManifestJSON;
    try {
      manifest = ProjectManifestJSON.parse(
        JSON.parse(fs.readFileSync(manifestPath, { encoding: "utf-8" }))
      );
    } catch {
      manifest = { componentURLs: [] };
    }

    const pages = new Map<string, PageJSON>();

    const pagePaths = globSync(this.filePattern, {
      cwd: rootPath,
    });
    pagePaths.sort();

    for (const pagePath of pagePaths) {
      const pageJSON = PageJSON.parse(
        JSON.parse(
          fs.readFileSync(path.resolve(rootPath, pagePath), {
            encoding: "utf-8",
          })
        )
      );
      pages.set(pagePath.replace(/\.uimix$/, ""), pageJSON);
    }
    const newProjectJSON = filesToProjectJSON(manifest, pages);

    if (compareProjectJSONs(this.json, newProjectJSON)) {
      return false;
    }

    this.json = newProjectJSON;
    return true;
  }

  save(): void {
    const rootPath = this.rootPath;

    const { manifest, pages } = projectJSONToFiles(this.json);

    fs.writeFileSync(
      path.resolve(rootPath, this.manifestName),
      formatJSON(JSON.stringify(manifest))
    );

    const pagePathsToDelete = new Set(
      globSync(this.filePattern, {
        cwd: rootPath,
      })
    );

    for (const [pageName, pageJSON] of pages) {
      const pagePath = pageName + ".uimix";
      const pageDirPath = path.dirname(pagePath);
      mkdirpSync(path.resolve(rootPath, pageDirPath));
      fs.writeFileSync(
        path.resolve(rootPath, pagePath),
        formatJSON(JSON.stringify(pageJSON))
      );
      pagePathsToDelete.delete(pagePath);
    }

    for (const pagePath of pagePathsToDelete) {
      fs.rmSync(path.resolve(rootPath, pagePath));
    }
  }

  watch(onChange: (projectJSON: ProjectJSON) => void): () => void {
    const watchPath = path.resolve(this.rootPath, this.filePattern);

    // FIXME: chokidar looks like making UI slow
    const watcher = chokidar.watch(watchPath, {
      ignored: ["**/node_modules/**", "**/.git/**"],
    });
    console.log("start watching...");

    const _onChange = () => {
      try {
        if (this.load()) {
          onChange(this.json);
        }
      } catch (e) {
        console.error(e);
      }
    };

    watcher.on("change", _onChange);
    watcher.on("add", _onChange);
    watcher.on("unlink", _onChange);

    return () => watcher.close();
  }
}

function projectJSONToFiles(projectJSON: ProjectJSON): {
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

function filesToProjectJSON(
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
