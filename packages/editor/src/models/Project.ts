import * as Y from "yjs";
import { Selectable, SelectableMap } from "./Selectable";
import { Node, NodeMap } from "./Node";
import { ProjectJSON } from "@uimix/node-data";
import { ImageManager } from "./ImageManager";
import { Component } from "./Component";
import { ObservableYArray } from "../utils/ObservableYArray";
import { loadProjectJSON, toProjectJSON } from "./ProjectJSON";
import { ColorTokenList } from "./ColorToken";
import { PageList } from "./PageList";

export class Project {
  constructor(doc: Y.Doc) {
    this.doc = doc;
    this.nodes = new NodeMap(this);
    this.selectables = new SelectableMap(this);
    this.colorTokens = new ColorTokenList(this);
    this.node = this.nodes.create("project", "project");
    this.pages = new PageList(this);
  }

  readonly doc: Y.Doc;
  readonly nodes: NodeMap;
  readonly selectables: SelectableMap;
  readonly colorTokens: ColorTokenList;
  readonly node: Node;
  readonly pages: PageList;
  readonly imageManager = new ImageManager(this);

  createUndoManager(): Y.UndoManager {
    return new Y.UndoManager([
      this.doc.getMap("nodes"),
      this.doc.getMap("styles"),
      this.doc.getMap("selection"),
      this.doc.getArray("componentURLs"),
      this.doc.getMap("colors"),
    ]);
  }

  toJSON(): ProjectJSON {
    return toProjectJSON(this.doc);
  }

  loadJSON(json: ProjectJSON) {
    loadProjectJSON(this.doc, json);
  }

  get components(): Component[] {
    const components: Component[] = [];

    for (const page of this.pages.all) {
      for (const node of page.node.children) {
        const component = Component.from(node);
        if (component) {
          components.push(component);
        }
      }
    }

    return components;
  }

  get componentURLs(): ObservableYArray<string> {
    return ObservableYArray.get(this.doc.getArray("componentURLs"));
  }

  clearSelection() {
    this.selectables.selectionData.clear();
  }

  replaceSelection(selectables: Iterable<Selectable>) {
    this.clearSelection();
    for (const selectable of selectables) {
      selectable.select();
    }
  }
}
