import {
  Image,
  ColorToken,
  NodeJSON,
  PageJSON,
  ProjectJSON,
  ProjectManifestJSON,
  StyleJSON,
  ImageType,
} from "@uimix/model/src/data/v1";
import { getPageID, usedImageHashesInStyle } from "@uimix/model/src/data/util";
import { isEqual, omit } from "lodash-es";
import { formatJSON, formatTypeScript } from "../format";
import { FileAccess } from "./FileAccess";
import * as path from "path";
import {
  HierarchicalNodeJSON,
  toHierarchicalNodeJSONs,
} from "./HierarchicalNodeJSON";
import { Project } from "@uimix/model/src/models";
import { ProjectEmitter } from "../files/ProjectEmitter";
import {
  PageNode,
  loadFromJSXFile,
  stringifyAsJSXFile,
} from "../files/HumanReadableFormat";
import { ProjectLoader } from "../files/ProjectLoader";
import { getURLSafeBase64Hash } from "@uimix/foundation/src/utils/Hash";
import * as mime from "mime-types";
import sizeOf from "image-size";

interface ProjectData {
  manifest: ProjectManifestJSON;
  project: Project;
  pages: Map<string, PageNode>;
  imagePaths: Map<string, string>; // hash to path
}

// Important TODO: fix paths in Windows!!
export class WorkspaceLoader {
  static async load(fileAccess: FileAccess) {
    const loader = new WorkspaceLoader(fileAccess);
    await loader.load();
    return loader;
  }

  constructor(fileAccess: FileAccess) {
    this.fileAccess = fileAccess;
  }

  readonly fileAccess: FileAccess;

  get rootPath(): string {
    return this.fileAccess.rootPath;
  }

  readonly filePattern = "**/*.uimix";
  readonly imagePatterns = ["**/*.png", "**/*.jpg", "**/*.jpeg"];
  readonly uimixProjectFile = "uimix.json";
  readonly projectBoundary = "package.json"; // TODO: other project boundaries
  projects = new Map<string, ProjectData>(); // project path -> project json

  get rootProject(): ProjectData {
    return this.getOrCreateProject(this.rootPath);
  }

  getOrCreateProject(projectPath: string): ProjectData {
    let project = this.projects.get(projectPath);
    if (!project) {
      project = {
        manifest: {},
        project: new Project(),
        pages: new Map(),
        imagePaths: new Map(),
      };
      this.projects.set(projectPath, project);
    }
    return project;
  }

  projectPathForFile(pagePath: string): string {
    return (
      [...this.projects.keys()]
        .sort((a, b) => b.length - a.length)
        .find((projectPath) => pagePath.startsWith(projectPath + path.sep)) ??
      this.rootPath
    );
  }

  async load(): Promise<boolean> {
    const filePaths = await this.fileAccess.glob(
      `{${this.filePattern},${this.imagePatterns.join(",")},**/${
        this.projectBoundary
      }}`
    );
    filePaths.sort();

    const filePathsForProject = new Map<string, string[]>([
      [this.rootPath, []],
    ]);

    for (const manifestPaths of filePaths.filter((filePath) =>
      filePath.endsWith(this.projectBoundary)
    )) {
      const parentPath = path.dirname(manifestPaths);
      filePathsForProject.set(parentPath, []);
    }

    for (const filePath of filePaths) {
      if (filePath.endsWith(this.projectBoundary)) {
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

    for (const [projectPath, filePaths] of filePathsForProject) {
      let manifest: ProjectManifestJSON = {};

      const manifestPath = path.join(projectPath, this.uimixProjectFile);
      if ((await this.fileAccess.stat(manifestPath))?.type === "file") {
        try {
          manifest = ProjectManifestJSON.parse(
            JSON.parse(
              (
                await this.fileAccess.readFile(
                  path.join(projectPath, this.uimixProjectFile)
                )
              ).toString()
            )
          );
        } catch (e) {
          console.warn("cannot load uimix.json:", e);
        }
      }

      const images = new Map<string, Image>();
      const pages = new Map<string, PageNode>();
      const imagePaths = new Map<string, string>();

      for (const filePath of filePaths) {
        // TODO: reload changed files only

        if (filePath.endsWith(".uimix")) {
          const pageText = (
            await this.fileAccess.readFile(filePath)
          ).toString();
          const pageNode = loadFromJSXFile(pageText);
          const pageName = path
            .relative(projectPath, filePath)
            .replace(/\.uimix$/, "");
          pages.set(pageName, pageNode);
        } else {
          // TODO: lookup specific directories only
          console.log(filePath);
          const imageData = await this.fileAccess.readFile(filePath);
          const hash = await getURLSafeBase64Hash(imageData);
          const mimeType = mime.lookup(filePath) || "image/png";
          const size = sizeOf(imageData);

          const image: Image = {
            width: size.width ?? 0,
            height: size.height ?? 0,
            type: mimeType as ImageType,
            url: `data:${mimeType};base64,${imageData.toString("base64")}`,
          };
          images.set(hash, image);
          imagePaths.set(hash, filePath);
        }
      }

      const existingProject = this.projects.get(projectPath);

      const loader = new ProjectLoader(existingProject?.project);
      loader.load(pages);
      for (const [key, image] of images) {
        loader.project.imageManager.images.set(key, image);
      }

      if (!isEqual(pages, existingProject?.pages ?? new Map())) {
        changed = true;
      }

      this.projects.set(projectPath, {
        manifest,
        project: loader.project,
        pages,
        imagePaths,
      });
    }

    return changed;
  }

  private isSaving = false;

  async save(projectPathToSave?: string): Promise<void> {
    try {
      this.isSaving = true;

      const pagePathsToDelete = new Set(
        await this.fileAccess.glob(this.filePattern)
      );

      for (const [projectPath, project] of this.projects) {
        if (projectPathToSave && projectPath !== projectPathToSave) {
          continue;
        }

        const projectEmitter = new ProjectEmitter(project.project);
        const pages = projectEmitter.emit();

        for (const [pageName, pageNode] of pages) {
          const pagePath = path.join(projectPath, pageName + ".uimix");
          await this.fileAccess.writeFile(
            pagePath,
            Buffer.from(formatTypeScript(stringifyAsJSXFile(pageNode)))
          );
          pagePathsToDelete.delete(pagePath);
        }

        // TODO: save images

        const manifestPath = path.join(projectPath, this.uimixProjectFile);

        let parsed: ProjectManifestJSON;
        try {
          parsed = JSON.parse(
            (await this.fileAccess.readFile(manifestPath)).toString()
          ) as ProjectManifestJSON;
        } catch (e) {
          parsed = {};
        }
        parsed.prebuiltAssets = project.manifest.prebuiltAssets;

        // TODO: avoid overwriting malformed uimix.json

        await this.fileAccess.writeFile(
          manifestPath,
          Buffer.from(formatJSON(JSON.stringify(parsed)))
        );

        project.pages = pages;
      }

      for (const pagePath of pagePathsToDelete) {
        await this.fileAccess.remove(pagePath);
      }
    } finally {
      this.isSaving = false;
    }
  }

  watch(onChange: () => void): () => void {
    console.log("start watching...");

    return this.fileAccess.watch(
      `{${this.filePattern},**/${this.projectBoundary}}`,
      async () => {
        try {
          if (this.isSaving) {
            return;
          }
          if (await this.load()) {
            onChange();
          }
        } catch (e) {
          console.error(e);
        }
      }
    );
  }
}

export function projectJSONToFiles(projectJSON: ProjectJSON): {
  manifest: ProjectManifestJSON;
  pages: Map<string, PageJSON>;
} {
  const manifest: ProjectManifestJSON = {
    prebuiltAssets: projectJSON.componentURLs,
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
      images: { ...projectJSON.images },
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

  for (const pageJSON of pages.values()) {
    // delete dangling images

    const usedImageHashes = new Set<string>();
    for (const style of Object.values(pageJSON.styles)) {
      for (const hash of usedImageHashesInStyle(style)) {
        usedImageHashes.add(hash);
      }
    }

    if (pageJSON.images) {
      for (const hash of Object.keys(pageJSON.images)) {
        if (!usedImageHashes.has(hash)) {
          delete pageJSON.images[hash];
        }
      }
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
    componentURLs: manifest.prebuiltAssets ?? [],
    images,
    colors,
  };
}
