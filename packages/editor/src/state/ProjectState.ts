import { computed, makeObservable, observable } from "mobx";
import * as Y from "yjs";
import {
  NodeClipboardData,
  ProjectJSON,
  SelectableJSON,
} from "@uimix/node-data";
import { Project } from "../models/Project";
import { Selectable } from "../models/Selectable";
import { getIncrementalUniqueName } from "../utils/Name";
import { generateExampleNodes } from "../models/generateExampleNodes";
import demoFile from "../../../sandbox/src/uimix/landing.uimix?raw";
import { reassignNewIDs } from "../models/ProjectJSONExtra";
import { PageState } from "./PageState";
import { Page } from "../models/Page";

export class ProjectState {
  constructor() {
    this.project = new Project(this.doc);
    this.undoManager = this.project.createUndoManager();
    makeObservable(this);
  }

  readonly doc = new Y.Doc();
  readonly project: Project;
  @observable pageID: string | undefined;
  @computed get page(): Page | undefined {
    if (!this.pageID) {
      return;
    }
    const pageNode = this.project.nodes.get(this.pageID);
    if (!pageNode) {
      return;
    }
    return Page.from(pageNode);
  }
  readonly undoManager: Y.UndoManager;

  readonly pageStates = new WeakMap<Page, PageState>();
  get pageState(): PageState | undefined {
    const page = this.page;
    if (!page) {
      return;
    }

    let pageState = this.pageStates.get(page);
    if (!pageState) {
      pageState = new PageState(page);
      this.pageStates.set(page, pageState);
    }
    return pageState;
  }

  // MARK: Selection

  @computed get selectedSelectables(): Selectable[] {
    return this.pageState?.selectedSelectables ?? [];
  }

  // MARK: Collapsing

  readonly collapsedPaths = observable.set<string>();

  // MARK: Nodes

  setupInitContent() {
    const pages = this.project.pages.all;
    if (pages.length === 0) {
      const page = this.project.nodes.create("page");
      page.name = "Page 1";
      this.project.node.append([page]);
      this.pageID = page.id;
      generateExampleNodes(page);
      if (this.project.componentURLs.length === 0) {
        this.project.componentURLs.push([
          "https://cdn.jsdelivr.net/gh/uimix-editor/uimix@ba0157d5/packages/sandbox/dist-components/components.js",
          "https://cdn.jsdelivr.net/gh/uimix-editor/uimix@ba0157d5/packages/sandbox/dist-components/style.css",
        ]);
      }
    } else {
      this.pageID = pages[0].id;
    }
    this.undoManager.clear();
  }

  loadDemoFile() {
    let demoProject = ProjectJSON.parse(JSON.parse(demoFile));
    demoProject = reassignNewIDs(demoProject);

    this.project.loadJSON(demoProject);
    this.pageID = this.project.pages.all[0].id;
    this.undoManager.clear();
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

  getNodeClipboardData(): NodeClipboardData | undefined {
    const selection = this.selectedSelectables;
    if (selection.length === 0) {
      return undefined;
    }

    const nodes = selection.map((s) => {
      if (s.originalNode.type === "component") {
        // TODO: improve component copy/paste
        // serialize component root instead
        return s.children[0].toJSON();
      }
      return s.toJSON();
    });
    return {
      uimixClipboardVersion: "0.0.1",
      type: "nodes",
      nodes,
      images: {}, // TODO
    };
  }

  async pasteNodeClipboardData(data: NodeClipboardData) {
    const getInsertionTarget = () => {
      const defaultTarget = {
        parent: this.page?.node,
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

    const hydrateJSON = (json: SelectableJSON): Selectable => {
      const project = this.project;
      if (json.original?.type === "component") {
        // create instance

        const node = project.nodes.create("instance");
        node.name = json.name;
        const selectable = node.selectable;
        // TODO: position
        selectable.style.mainComponent = json.original.id;

        return selectable;
      }

      if (json.original?.type === "variant") {
        throw new Error("TODO: pasting variant");
      }

      if (json.original?.type === "instance") {
        const mainComponent = json.style.mainComponent;
        if (mainComponent && project.nodes.get(mainComponent)) {
          // original component exists in the project

          const node = project.nodes.create("instance");
          node.name = json.name;
          const selectable = node.selectable;

          const loadOverride = (json: SelectableJSON) => {
            const idPath = json.id.split(":");
            idPath[0] = node.id;
            const selectable = project.selectables.get(idPath);
            selectable.selfStyle.loadJSON(json.selfStyle ?? {});

            for (const child of json.children) {
              loadOverride(child);
            }
          };
          loadOverride(json);

          return selectable;
        }
      }

      return Selectable.fromJSON(project, json);
    };

    const insertionTarget = getInsertionTarget();
    this.project.clearSelection();

    const selectables = data.nodes.map(hydrateJSON);

    insertionTarget.parent?.selectable.insertBefore(
      selectables,
      insertionTarget.next?.selectable,
      { fixPosition: false }
    );

    for (const selectable of selectables) {
      selectable.select();
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

  // MARK: Pages

  openPage(page: Page) {
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
}

export const projectState = new ProjectState();

// ProjectState does not support hot reloading
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    import.meta.hot?.invalidate();
  });
}
