import { computed, makeObservable, observable } from "mobx";
import * as Y from "yjs";
import * as Data from "@uimix/model/src/data/v1";
import { Project, Page, Selectable } from "@uimix/model/src/models";
import { getIncrementalUniqueName } from "@uimix/foundation/src/utils/Name";
import { PageState } from "./PageState";
import { ScrollState } from "./ScrollState";
import demoFile from "./demoFile/landing.uimixproject?raw";
import { Rect } from "paintvec";
import { resizeWithBoundingBox } from "@uimix/model/src/services";

export class ProjectState {
  constructor() {
    this.project = new Project();
    this.undoManager = this.project.createUndoManager();
    makeObservable(this);
  }

  get doc(): Y.Doc {
    return this.project.doc;
  }
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

  get pageState(): PageState | undefined {
    const page = this.page;
    if (!page) {
      return;
    }
    return PageState.from(page);
  }

  // MARK: Scroll

  get scroll(): ScrollState {
    return this.pageState?.scroll ?? new ScrollState();
  }

  // MARK: Selection

  @computed get selectedSelectables(): Selectable[] {
    return this.pageState?.selectedSelectables ?? [];
  }

  // MARK: Collapsing

  readonly collapsedPaths = observable.set<string>();

  // MARK: Nodes

  loadDemoFile() {
    const projectJSON = Data.Project.parse(JSON.parse(demoFile));
    this.project.loadJSON(projectJSON);
    this.project.componentURLs.push([
      "https://cdn.jsdelivr.net/gh/uimix-editor/uimix@ba0157d5/packages/sandbox/dist-components/components.js",
      "https://cdn.jsdelivr.net/gh/uimix-editor/uimix@ba0157d5/packages/sandbox/dist-components/style.css",
    ]);
    this.pageID = this.project.pages.all[0].id;
    this.undoManager.clear();
  }

  loadJSON(projectJSON: Data.Project) {
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

  async getNodeClipboardData(): Promise<Data.NodeClipboard | undefined> {
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

    const imageHashes = new Set<string>();
    for (const selectable of selection) {
      for (const hash of selectable.usedImageHashes) {
        imageHashes.add(hash);
      }
    }

    const images: Record<string, Data.Image> = {};
    for (const hash of imageHashes) {
      const image = await this.project.imageManager.getWithDataURL(hash);
      if (image) {
        images[hash] = image;
      }
    }

    return {
      uimixClipboardVersion: "0.0.1",
      type: "nodes",
      nodes,
      images,
    };
  }

  async pasteNodeClipboardData(data: Data.NodeClipboard) {
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

    const hydrateJSON = (json: Data.Selectable): Selectable => {
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

          const loadOverride = (json: Data.Selectable) => {
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

    // wait for render
    // TODO: better time
    await new Promise((resolve) => setTimeout(resolve, 100));

    const bbox = Rect.union(...selectables.map((s) => s.computedRect));
    if (bbox) {
      const viewportRect = projectState.scroll.viewportRectInDocument;
      // fix position when bbox is outside of the page
      const isInside = !!bbox.intersection(viewportRect);
      if (
        !isInside &&
        insertionTarget.parent?.selectable.style.layout === "none"
      ) {
        const offset = viewportRect.center.sub(bbox.center);
        for (const selectable of selectables) {
          resizeWithBoundingBox(
            selectable,
            selectable.computedRect.translate(offset),
            {
              x: true,
              y: true,
            }
          );
        }
      }
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
      this.project.pages.all.map((d) => d.filePath)
    );
    const newPath = getIncrementalUniqueName(existingFilePaths, name);

    const page = this.project.nodes.create("page");
    page.name = newPath;
    this.project.node.append([page]);

    this.undoManager.stopCapturing();
  }

  deletePageOrPageFolder(path: string) {
    const deletedPages = this.project.pages.delete(path);

    const deletingCurrent = this.page
      ? deletedPages.includes(this.page)
      : false;
    if (deletingCurrent) {
      this.pageID = this.project.pages.all[0]?.id;
    }

    this.undoManager.stopCapturing();
  }

  renamePageOrPageFolder(path: string, newPath: string) {
    const { originalPages, newPages } = this.project.pages.rename(
      path,
      newPath
    );

    const selectedOriginalPageIndex = originalPages.findIndex(
      (page) => page.id === this.pageID
    );
    if (selectedOriginalPageIndex !== -1) {
      this.pageID = newPages[selectedOriginalPageIndex].id;
    }

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
