import { computed, makeObservable, observable } from "mobx";
import * as Y from "yjs";
import { ProjectJSON } from "@uimix/node-data";
import { Project } from "../models/Project";
import { Selectable } from "../models/Selectable";
import { Node } from "../models/Node";
import { getIncrementalUniqueName } from "../utils/Name";

export class ProjectState {
  constructor() {
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

  async pasteNodes(data: ProjectJSON) {
    const getInsertionTarget = () => {
      const defaultTarget = {
        parent: this.page,
        next: undefined,
      };

      const selectedSelectables = this.selectedSelectables;
      let lastSelectable: Selectable | undefined =
        selectedSelectables[selectedSelectables.length - 1];
      while (lastSelectable && lastSelectable.idPath.length > 1) {
        lastSelectable = lastSelectable.parent;
      }
      if (!lastSelectable) {
        return defaultTarget;
      }

      const parent = lastSelectable?.parent;
      if (!parent) {
        return defaultTarget;
      }

      return {
        parent: parent.originalNode,
        next: lastSelectable.originalNode.nextSibling,
      };
    };

    const insertionTarget = getInsertionTarget();
    this.page?.selectable.deselect();

    const nodes: Node[] = [];
    for (const [id, nodeJSON] of Object.entries(data.nodes)) {
      const node = this.project.nodes.create(nodeJSON.type, id);
      node.loadJSON(nodeJSON);
      nodes.push(node);
    }
    const topNodes = nodes.filter((node) => !node.parentID);

    insertionTarget.parent?.insertBefore(topNodes, insertionTarget.next);

    for (const [id, styleJSON] of Object.entries(data.styles)) {
      const selectable = this.project.selectables.get(id.split(":"));
      if (selectable) {
        selectable.selfStyle.loadJSON(styleJSON);
      }
    }

    for (const node of topNodes) {
      node.selectable.select();
    }

    // load images
    await Promise.all(
      Object.entries(data.images ?? {}).map(async ([hash, image]) => {
        if (this.project.imageManager.has(hash)) {
          return;
        }
        const blob = await fetch(image.url).then((res) => res.blob());
        await this.project.imageManager.insert(blob);
      })
    );
  }
}

export const projectState = new ProjectState();

// ProjectState does not support hot reloading
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    import.meta.hot?.invalidate();
  });
}
