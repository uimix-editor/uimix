import { MenuItem } from "@seanchas116/paintkit/dist/components/menu/Menu";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { action, makeObservable, observable } from "mobx";
import { Component } from "../models/Component";
import { Document, DocumentJSON } from "../models/Document";
import { Element } from "../models/Element";
import { ElementInstance } from "../models/ElementInstance";
import { Text } from "../models/Text";
import { TextInstance } from "../models/TextInstance";
import { ElementInspectorState } from "./ElementInspectorState";

export class EditorState {
  constructor(history: JSONUndoHistory<DocumentJSON, Document>) {
    this.history = history;
    makeObservable(this);
  }

  readonly history: JSONUndoHistory<DocumentJSON, Document>;

  get document(): Document {
    return this.history.target;
  }

  @observable currentOutlineTab: "outline" | "assets" = "outline";
  @observable currentInspectorTab: "element" | "style" = "element";
  @observable sideBarSplitRatio = 0.3;
  @observable sideBarWidth = 256;

  readonly elementInspectorState = new ElementInspectorState(this);

  @observable hoveredItem: ElementInstance | TextInstance | undefined =
    undefined;

  getOutlineContextMenu(): MenuItem[] {
    return [
      {
        text: "Add Component",
        run: action(() => {
          const component = new Component();
          this.document.components.append(component);
          this.history.commit("Add Component");
          return true;
        }),
      },
    ];
  }

  getElementContextMenu(instance: ElementInstance): MenuItem[] {
    return [
      {
        text: "Add Element",
        run: action(() => {
          const element = new Element({ tagName: "div" });
          instance.element.append(element);
          this.history.commit("Add Element");
          return true;
        }),
      },
      {
        text: "Add Text",
        run: action(() => {
          const text = new Text({ content: "Text" });
          instance.element.append(text);
          this.history.commit("Add Text");
          return true;
        }),
      },
    ];
  }
}
