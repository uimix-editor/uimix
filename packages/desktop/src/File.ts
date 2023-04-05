import fs from "fs";
import path from "path";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import {
  NodeJSON,
  PageJSON,
  ProjectJSON,
  ProjectManifestJSON,
  StyleJSON,
} from "../../node-data/src";
import { DocumentMetadata } from "../../dashboard/src/types/DesktopAPI";
import { TypedEmitter } from "tiny-typed-emitter";
import { app, dialog } from "electron";
import { isEqual, omit } from "lodash";
import chokidar from "chokidar";
import { sha256 } from "js-sha256";
import { mkdirpSync } from "mkdirp";
import { glob } from "glob";

export function compareProjectJSONs(a: ProjectJSON, b: ProjectJSON): boolean {
  return (
    JSON.stringify(a.nodes) === JSON.stringify(b.nodes) &&
    JSON.stringify(a.styles) === JSON.stringify(b.styles) &&
    JSON.stringify(a.componentURLs) === JSON.stringify(b.componentURLs)
    // do not compare images because they are too big
  );
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

interface ProjectJSONFiles {
  manifest: ProjectManifestJSON;
  pages: Map<string /* file path */, PageJSON>;
}

function projectJSONToFiles(projectJSON: ProjectJSON): ProjectJSONFiles {
  const manifest: ProjectManifestJSON = {
    componentURLs: projectJSON.componentURLs,
    images: projectJSON.images,
    colors: projectJSON.colors,
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

function saveProjectToDirectory(
  projectDirPath: string,
  files: ProjectJSONFiles
): void {
  fs.writeFileSync(
    path.resolve(projectDirPath, "uimix.json"),
    formatJSON(JSON.stringify(files.manifest))
  );

  for (const [pagePath, pageJSON] of files.pages) {
    const pageDirPath = path.dirname(pagePath);
    mkdirpSync(path.resolve(projectDirPath, pageDirPath));
    fs.writeFileSync(
      path.resolve(projectDirPath, pagePath),
      formatJSON(JSON.stringify(pageJSON))
    );
  }
}

function filesToProjectJSON(files: ProjectJSONFiles): ProjectJSON {
  // TODO: detect ID conflicts between files (and provide way to resolve them)

  const projectJSON: ProjectJSON = {
    nodes: {},
    styles: {},
    componentURLs: files.manifest.componentURLs,
    images: files.manifest.images,
    colors: files.manifest.colors,
  };

  const projectNode: NodeJSON = {
    type: "project",
    index: 0,
  };
  projectJSON.nodes["project"] = projectNode;

  let nextNodeIndex = 1;
  for (const [pageName, pageJSON] of files.pages) {
    // TODO
    const pageID: string = sha256(pageName);

    const pageNode: NodeJSON = {
      type: "page",
      index: nextNodeIndex++,
      name: pageName,
      parent: "project",
    };
    projectJSON.nodes[pageID] = pageNode;

    for (const [id, node] of Object.entries(pageJSON.nodes)) {
      projectJSON.nodes[id] = {
        ...node,
        parent: node.parent ?? pageID,
      };
    }

    for (const [id, style] of Object.entries(pageJSON.styles)) {
      projectJSON.styles[id] = style;
    }
  }

  return projectJSON;
}

function loadProjectFromDirectory(projectDirPath: string): ProjectJSONFiles {
  const manifestPath = path.resolve(projectDirPath, "uimix.json");
  let manifest: ProjectManifestJSON;
  try {
    manifest = ProjectManifestJSON.parse(
      JSON.parse(fs.readFileSync(manifestPath, { encoding: "utf-8" }))
    );
  } catch {
    manifest = { componentURLs: [], images: {}, colors: {} };
  }

  const pages = new Map<string, PageJSON>();

  const pagePaths = glob.sync("**/*.uimix", {
    cwd: projectDirPath,
  });

  for (const pagePath of pagePaths) {
    const pageJSON = PageJSON.parse(
      JSON.parse(
        fs.readFileSync(path.resolve(projectDirPath, pagePath), {
          encoding: "utf-8",
        })
      )
    );
    pages.set(pagePath, pageJSON);
  }

  return {
    manifest,
    pages,
  };
}

export class File extends TypedEmitter<{
  editedChange: (edited: boolean) => void;
  metadataChange: (metadata: DocumentMetadata) => void;
  dataChange: (data: ProjectJSON) => void;
}> {
  constructor(filePath?: string) {
    super();

    this.filePath = filePath;
    if (filePath) {
      app.addRecentDocument(filePath);
    }
    this._data = filePath
      ? filesToProjectJSON(loadProjectFromDirectory(filePath))
      : // default project
        {
          nodes: {
            project: { type: "project", index: 0 },
          },
          styles: {},
        };
    this.savedData = this._data;
    if (filePath) {
      this.watch();
    }
  }

  get name(): string {
    return this.filePath ? path.basename(this.filePath) : "Untitled";
  }

  get metadata(): DocumentMetadata {
    return {
      name: this.name,
    };
  }

  filePath?: string;
  edited = false;

  private _data: ProjectJSON;
  get data(): ProjectJSON {
    return this._data;
  }
  setData(data: ProjectJSON) {
    this._data = data;
    this.edited = !compareProjectJSONs(this.savedData, this._data);
    this.emit("editedChange", this.edited);
  }

  private savedData: ProjectJSON;

  revert() {
    this.setData(this.savedData);
    this.emit("dataChange", this.data);
  }

  save() {
    if (!this.filePath) {
      this.saveAs();
      return;
    }

    saveProjectToDirectory(this.filePath, projectJSONToFiles(this.data));
    app.addRecentDocument(this.filePath);
    this.savedData = this.data;
    this.edited = false;
    this.emit("editedChange", this.edited);
  }

  saveAs() {
    const newPath = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    })?.[0];
    if (!newPath) {
      return;
    }
    console.log("newPath", newPath);

    this.filePath = newPath;
    this.save();
    this.watch();

    this.emit("metadataChange", this.metadata);
  }

  static open() {
    const filePath = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    })?.[0];
    if (!filePath) {
      return;
    }
    return new File(filePath);
  }

  watch() {
    if (this.watchDisposer) {
      this.watchDisposer();
      this.watchDisposer = undefined;
    }

    if (!this.filePath) {
      return;
    }
    const filePath = this.filePath;

    const watcher = chokidar.watch(filePath);
    watcher.on("change", () => {
      try {
        const json = ProjectJSON.parse(
          JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }))
        );
        if (isEqual(json, this._data)) {
          return;
        }
        if (this.edited) {
          // TODO: warn
          return;
        }
        this._data = json;
        this.savedData = json;
        this.emit("dataChange", json);
      } catch (e) {
        console.error(e);
      }
    });
    this.watchDisposer = () => {
      void watcher.close();
    };
  }
  private watchDisposer?: () => void;
}

function formatJSON(text: string): string {
  return prettier.format(text, {
    parser: "json",
    plugins: [parserBabel],
  });
}
