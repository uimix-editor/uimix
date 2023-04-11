import * as Y from "yjs";
import { Selectable, SelectableMap } from "./Selectable";
import { Node, NodeMap } from "./Node";
import { ProjectJSON } from "../data/v1";
import { ImageManager } from "./ImageManager";
import { Component } from "./Component";
import { ObservableYArray } from "@uimix/foundation/src/utils/ObservableYArray";
import { ColorTokenMap } from "./ColorToken";
import { PageList } from "./PageList";
import { ProjectData } from "../collaborative/ProjectData";

export class Project {
  constructor() {
    this.nodes = new NodeMap(this);
    this.selectables = new SelectableMap(this);
    this.colorTokens = new ColorTokenMap(this);
    this.node = this.nodes.create("project", "project");
    this.pages = new PageList(this);
  }

  readonly data = new ProjectData();
  readonly nodes: NodeMap;
  readonly selectables: SelectableMap;
  readonly colorTokens: ColorTokenMap;
  readonly node: Node;
  readonly pages: PageList;
  readonly imageManager = new ImageManager(this);

  get doc(): Y.Doc {
    return this.data.doc;
  }

  createUndoManager(): Y.UndoManager {
    return new Y.UndoManager([
      this.data.nodes,
      this.data.styles,
      this.data.selection,
      this.data.componentURLs,
      this.data.colors,
    ]);
  }

  toJSON(): ProjectJSON {
    return this.data.toJSON();
  }

  loadJSON(json: ProjectJSON) {
    this.data.loadJSON(json);
  }

  get components(): Component[] {
    return this.pages.all.flatMap((page) => page.components);
  }

  get componentURLs(): ObservableYArray<string> {
    return ObservableYArray.get(this.data.componentURLs);
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
