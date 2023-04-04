import { posix as path } from "path-browserify";
import { Node } from "./Node";
import { computed, makeObservable } from "mobx";
import { Page } from "./Page";
import { compact } from "lodash-es";
import { assertNonNull } from "@uimix/foundation/src/utils/Assert";
import { Project } from "./Project";

export interface PageHierarchyFolderEntry {
  type: "directory";
  id: string;
  path: string;
  name: string;
  children: PageHierarchyEntry[];
}

export interface PageHierarchyPageEntry {
  type: "file";
  id: string;
  path: string;
  name: string;
  page: Page;
}

export type PageHierarchyEntry =
  | PageHierarchyFolderEntry
  | PageHierarchyPageEntry;

export class PageList {
  constructor(project: Project) {
    this.project = project;
    this.node = project.node;
    makeObservable(this);
  }

  node: Node;
  readonly project: Project;

  @computed get count(): number {
    return this.node.childCount;
  }

  get all(): Page[] {
    return compact(this.node.children.map((node) => Page.from(node)));
  }

  create(filePath: string): Page {
    const node = this.project.nodes.create("page");
    const page = assertNonNull(Page.from(node));
    page.name = filePath;
    return page;
  }

  toHierarchy(): PageHierarchyFolderEntry {
    const root: PageHierarchyFolderEntry = {
      type: "directory",
      id: "",
      name: "",
      path: "",
      children: [],
    };
    const parents = new Map<string, PageHierarchyFolderEntry>();
    parents.set("", root);

    const mkdirp = (segments: string[]): PageHierarchyFolderEntry => {
      if (segments.length === 0) {
        return root;
      }

      const existing = parents.get(segments.join("/"));
      if (existing) {
        return existing;
      }

      const parent = mkdirp(segments.slice(0, -1));
      const dir: PageHierarchyFolderEntry = {
        type: "directory",
        id: segments.join("/"),
        name: segments[segments.length - 1],
        path: segments.join("/"),
        children: [],
      };
      parent.children.push(dir);
      parents.set(segments.join("/"), dir);
      return dir;
    };

    const pages = Array.from(this.all);
    pages.sort((a, b) => a.name.localeCompare(b.name));

    for (const page of pages) {
      const segments = page.name.split(path.sep);
      const parent = mkdirp(segments.slice(0, -1));

      const item: PageHierarchyPageEntry = {
        type: "file",
        id: page.id,
        name: segments[segments.length - 1],
        path: page.name,
        page,
      };
      parent.children.push(item);
    }

    return root;
  }

  affectedPagesForPath(path: string): Page[] {
    return this.all.filter(
      (page) => page.name === path || page.name.startsWith(path + "/")
    );
  }

  deletePageOrPageFolder(path: string) {
    const pagesToDelete = this.affectedPagesForPath(path);

    for (const page of pagesToDelete) {
      page.node.remove();
      // TODO: delete dangling nodes?
      //this.project.nodes.remove(doc.root);
    }
  }

  renamePageOrPageFolder(path: string, newPath: string) {
    if (path === newPath) {
      return;
    }

    const pagesToDelete = this.affectedPagesForPath(path);

    for (const page of pagesToDelete) {
      page.name = newPath + page.name.slice(path.length);
    }
  }
}
