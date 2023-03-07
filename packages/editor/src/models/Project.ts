/* eslint-disable @typescript-eslint/no-explicit-any */

import * as Y from "yjs";
import { posix as path } from "path-browserify";
import { getOrCreate } from "../state/Collection";
import { SelectableMap } from "./Selectable";
import { Node, NodeMap } from "./Node";
import { computed, makeObservable, ObservableMap } from "mobx";
import { ProjectJSON } from "@uimix/node-data";
import { toProjectJSON } from "./toProjectJSON";
import { ImageManager } from "./ImageManager";
import { Component } from "./Component";
import { ObservableYMap } from "../utils/ObservableYMap";

export interface PageHierarchyFolderEntry {
  type: "directory";
  path: string;
  name: string;
  children: PageHierarchyEntry[];
}

export interface PageHierarchyPageEntry {
  type: "file";
  path: string;
  name: string;
  page: Node;
}

export type PageHierarchyEntry =
  | PageHierarchyFolderEntry
  | PageHierarchyPageEntry;

class Pages {
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

  get all(): Node[] {
    return this.node.children;
  }

  create(filePath: string): Node {
    const node = this.project.nodes.create("page");
    node.name = filePath;
    return node;
  }

  toHierarchy(): PageHierarchyFolderEntry {
    const root: PageHierarchyFolderEntry = {
      type: "directory",
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
        name: segments[segments.length - 1],
        path: page.name,
        page,
      };
      parent.children.push(item);
    }

    return root;
  }

  affectedPagesForPath(path: string): Node[] {
    return this.all.filter(
      (page) => page.name === path || page.name.startsWith(path + "/")
    );
  }

  deletePageOrPageFolder(path: string) {
    const pagesToDelete = this.affectedPagesForPath(path);

    for (const page of pagesToDelete) {
      page.remove();
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

export class Project {
  constructor(data: Y.Map<any>) {
    this.data = ObservableYMap.get(data);
    this.nodes = new NodeMap(this);
    this.selectables = new SelectableMap(this);
    this.node = this.nodes.create("project", "project");
    this.pages = new Pages(this);
  }

  readonly data: ObservableYMap<any>;
  readonly nodes: NodeMap;
  readonly selectables: SelectableMap;
  readonly node: Node;
  readonly pages: Pages;
  readonly imageManager = new ImageManager();

  toJSON(): ProjectJSON {
    return toProjectJSON(this.node.children.map((c) => c.selectable));
  }

  loadJSON(json: ProjectJSON) {
    this.node.clear();

    for (const [id, nodeJSON] of Object.entries(json.nodes)) {
      const node = this.nodes.getOrCreate(nodeJSON.type, id);
      node.loadJSON(nodeJSON);
      if (node.type === "page") {
        this.node.append([node]);
      }
    }
    for (const [id, style] of Object.entries(json.styles)) {
      const selectable = this.selectables.get(id.split(":"));
      selectable.selfStyle.loadJSON(style);
    }
  }

  get components(): Component[] {
    const components: Component[] = [];

    for (const page of this.pages.all) {
      for (const node of page.children) {
        const component = Component.from(node);
        if (component) {
          components.push(component);
        }
      }
    }

    return components;
  }
}
