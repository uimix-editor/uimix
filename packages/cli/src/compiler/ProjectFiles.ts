import {
  Image,
  ColorToken,
  NodeJSON,
  PageJSON,
  ProjectJSON,
  ProjectManifestJSON,
  StyleJSON,
} from "@uimix/node-data";
import { filter, omit } from "lodash-es";
import { mkdirpSync } from "mkdirp";
import { globSync } from "glob";
import path from "path";
import fs from "fs";
import { sha256 } from "js-sha256";
import { formatJSON } from "../format";
import chokidar from "chokidar";
import { encode } from "url-safe-base64";

function getURLSafeBase64Hash(data: string | Uint8Array): string {
  const hash = sha256.arrayBuffer(data);
  return encode(Buffer.from(hash).toString("base64"));
}

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

export class ProjectFiles {
  constructor(
    rootPath: string,
    options: {
      filePattern?: string;
    } = {}
  ) {
    this.rootPath = rootPath;
    this.filePattern = options.filePattern ?? "**/*.uimix";
  }

  readonly rootPath: string;
  readonly filePattern: string;
  manifest: ProjectManifestJSON = {};
  pages = new Map<string /* file path */, PageJSON>();

  toProjectJSON(): ProjectJSON {
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
    for (const [pageName, pageJSON] of this.pages) {
      const pageID: string = getURLSafeBase64Hash(pageName);

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
      componentURLs: this.manifest.componentURLs,
      images,
      colors,
    };
  }

  loadProjectJSON(projectJSON: ProjectJSON): void {
    const manifest: ProjectManifestJSON = {
      componentURLs: projectJSON.componentURLs,
    };

    const hierarchicalNodes = toHierarchicalNodeJSONs(projectJSON.nodes);
    const projectNode = hierarchicalNodes.find(
      (node) => node.type === "project"
    );
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

    this.manifest = manifest;
    this.pages = pages;
  }

  load(): void {
    const rootPath = this.rootPath;
    const manifestPath = path.resolve(rootPath, "uimix/project.json");
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

    this.manifest = manifest;
    this.pages = pages;
  }

  save(): void {
    const rootPath = this.rootPath;

    mkdirpSync(path.resolve(rootPath, "uimix"));
    mkdirpSync(path.resolve(rootPath, "uimix/images"));

    fs.writeFileSync(
      path.resolve(rootPath, "uimix/project.json"),
      formatJSON(JSON.stringify(this.manifest))
    );

    // for (const [hash, image] of Object.entries(this.manifest.images ?? {})) {
    //   const dataURL = image.url;
    //   // data url to buffer
    //   const base64 = dataURL.split(",")[1];
    //   const buffer = Buffer.from(base64, "base64");
    //   const ext = mime.extension(image.type);
    //   if (!ext) {
    //     console.error(`Unknown MIME type for ${image.type}`);
    //     continue;
    //   }

    //   fs.writeFileSync(
    //     path.resolve(rootPath, `uimix/images/${hash}.${ext}`),
    //     buffer
    //   );
    // }

    const pagePathsToDelete = new Set(
      globSync(this.filePattern, {
        cwd: rootPath,
      })
    );

    for (const [pageName, pageJSON] of this.pages) {
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

  watch(onChange: () => void): () => void {
    const watchPath = path.resolve(this.rootPath, this.filePattern);

    // FIXME: chokidar looks like making UI slow
    const watcher = chokidar.watch(watchPath, {
      ignored: ["**/node_modules/**", "**/dist/**"],
    });
    console.log("start watching...");

    const _onChange = () => {
      try {
        this.load();
        onChange();
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
