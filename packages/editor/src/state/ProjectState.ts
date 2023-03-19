import { computed, makeObservable, observable } from "mobx";
import * as Y from "yjs";
import { ProjectJSON } from "@uimix/node-data";
import { Project } from "../models/Project";
import { Selectable } from "../models/Selectable";
import { Node } from "../models/Node";
import { getIncrementalUniqueName } from "../utils/Name";
import { IFrameDataConnector } from "./IFrameDataConnector";

export class ProjectState {
  constructor() {
    new IFrameDataConnector(this);
    this.project = new Project(this.doc);
    this.undoManager = this.project.createUndoManager();
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

// ProjectState does not support hot reloading
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    import.meta.hot?.invalidate();
  });
}
