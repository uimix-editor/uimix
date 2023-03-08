import { computed, makeObservable, observable } from "mobx";
import * as Y from "yjs";
import { ProjectJSON } from "@uimix/node-data";
import { Project } from "../models/Project";
import { Selectable } from "../models/Selectable";
import { generateExampleNodes } from "../models/generateExampleNodes";
import { Node } from "../models/Node";
import { getIncrementalUniqueName } from "../utils/Name";
import { parentWindowTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";

export interface IRootToEditorRPCHandler {
  sync(data: Uint8Array): Promise<void>;
  init(data: Uint8Array): Promise<void>;
}

export interface IEditorToRootRPCHandler {
  ready(): Promise<void>;
  update(data: Uint8Array): Promise<void>;
}

class DataConnector {
  constructor(state: ProjectState) {
    this.state = state;
    this.state.doc.on("update", (data) => {
      this.updates.push(data);
      if (!this.sendQueued) {
        queueMicrotask(() => {
          this.sendUpdate();
        });
        this.sendQueued = true;
      }
    });

    this.rpc = new RPC(parentWindowTarget(), {
      sync: async (data: Uint8Array) => {
        console.log("uimix:sync");
        Y.applyUpdate(state.doc, data);
      },
      init: async (data: Uint8Array) => {
        console.log("uimix:init");
        Y.applyUpdate(state.doc, data);

        if (state.project.pages.all.length === 0) {
          const page = state.project.nodes.create("page");
          page.name = "Page 1";
          state.project.node.append([page]);
          state.pageID = page.id;
          generateExampleNodes(page);
        } else {
          state.pageID = state.project.pages.all[0].id;
        }
      },
    });

    this.rpc.remote.ready();
  }

  private state: ProjectState;
  private rpc: RPC<IEditorToRootRPCHandler, IRootToEditorRPCHandler>;
  private updates: Uint8Array[] = [];
  private sendQueued = false;

  sendUpdate() {
    this.sendQueued = false;
    if (this.updates.length) {
      this.rpc.remote.update(Y.mergeUpdates(this.updates));
      this.updates = [];
    }
  }
}

export class ProjectState {
  constructor() {
    new DataConnector(this);

    const projectData = this.doc.getMap("project");

    this.project = new Project(projectData);
    // const page = this.project.nodes.create("page");
    // page.name = "Page 1";
    // this.project.node.append([page]);
    // this.pageID = page.id;
    this.undoManager = new Y.UndoManager(projectData);
    //generateExampleNodes(page);
    makeObservable(this);
  }

  loadJSON(projectJSON: ProjectJSON) {
    if (Object.keys(projectJSON.nodes).length) {
      this.project.loadJSON(projectJSON);
      const allPages = this.project.pages.all;
      if (!allPages.some((p) => p.id === this.pageID)) {
        this.pageID = allPages[0]?.id;
      }
    } else {
      this.project.node.clear();
      const page = this.project.nodes.create("page");
      page.name = "Page 1";
      this.project.node.append([page]);
      this.pageID = page.id;
    }
  }

  readonly doc = new Y.Doc();
  readonly project: Project;
  @observable pageID: string | undefined;
  @computed get page(): Node | undefined {
    return this.pageID ? this.project.nodes.get(this.pageID) : undefined;
  }

  readonly undoManager: Y.UndoManager;

  @computed get selectedSelectables(): Selectable[] {
    return (
      this.page?.selectable?.children.flatMap((s) => s.selectedDescendants) ??
      []
    );
  }

  @computed get selectedNodes(): Node[] {
    const nodes: Node[] = [];
    for (const s of this.selectedSelectables) {
      if (s.idPath.length === 1) {
        nodes.push(s.originalNode);
      }
    }
    return nodes;
  }

  readonly collapsedPaths = observable.set<string>();

  openPage(page: Node) {
    this.pageID = page.id;
  }

  createPage(name: string) {
    const existingFilePaths = new Set(
      this.project.pages.all.map((d) => d.name)
    );
    const newPath = getIncrementalUniqueName(existingFilePaths, name);

    const page = this.project.nodes.create("page");
    page.name = newPath;
    this.project.node.append([page]);

    this.undoManager.stopCapturing();
  }

  deletePageOrPageFolder(path: string) {
    const affectedPages = this.project.pages.affectedPagesForPath(path);
    const deletingCurrent = this.page
      ? affectedPages.includes(this.page)
      : false;

    // if (this.project.pages.count === affectedPages.length) {
    //   return;
    // }
    this.project.pages.deletePageOrPageFolder(path);

    if (deletingCurrent) {
      this.pageID = this.project.pages.all[0]?.id;
    }

    this.undoManager.stopCapturing();
  }

  renamePageOrPageFolder(path: string, newPath: string) {
    this.project.pages.renamePageOrPageFolder(path, newPath);
    this.undoManager.stopCapturing();
  }

  deselectAll() {
    this.page?.selectable.deselect();
  }
}

export const projectState = new ProjectState();
