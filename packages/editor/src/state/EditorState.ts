import { MenuItem } from "@seanchas116/paintkit/dist/components/menu/Menu";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { KeyGesture } from "@seanchas116/paintkit/src/util/KeyGesture";
import { isTextInputFocused } from "@seanchas116/paintkit/src/util/CurrentFocus";
import { action, makeObservable, observable } from "mobx";
import { Component } from "../models/Component";
import { Document, DocumentJSON } from "../models/Document";
import { Element } from "../models/Element";
import { ElementInstance } from "../models/ElementInstance";
import { Text } from "../models/Text";
import { TextInstance } from "../models/TextInstance";
import { Variant } from "../models/Variant";
import { ElementInspectorState } from "./ElementInspectorState";
import { VariantInspectorState } from "./VariantInspectorState";

export class EditorState {
  constructor(getHistory: () => JSONUndoHistory<DocumentJSON, Document>) {
    this.getHistory = getHistory;
    makeObservable(this);
  }

  private readonly getHistory: () => JSONUndoHistory<DocumentJSON, Document>;

  get history(): JSONUndoHistory<DocumentJSON, Document> {
    return this.getHistory();
  }

  get document(): Document {
    return this.getHistory().target;
  }

  @observable currentOutlineTab: "outline" | "assets" = "outline";
  @observable currentInspectorTab: "element" | "style" = "element";
  @observable sideBarSplitRatio = 0.3;
  @observable sideBarWidth = 256;

  readonly variantInspectorState = new VariantInspectorState(this);
  readonly elementInspectorState = new ElementInspectorState(this);

  @observable hoveredItem: ElementInstance | TextInstance | undefined =
    undefined;

  @observable measureMode = false;
  @observable panMode = false;

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

  getComponentContextMenu(component: Component): MenuItem[] {
    return [
      {
        text: "Add Variant",
        run: action(() => {
          const variant = new Variant(component);
          variant.selector = ":hover";
          component.variants.push(variant);
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
          element.rename("div");
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

  getEditMenu(): MenuItem[] {
    return [
      {
        text: "Undo",
        disabled: !this.history.undoStack.canUndo,
        shortcut: [new KeyGesture(["Command"], "KeyZ")],
        run: action(() => {
          this.history.undoStack.undo();
          return true;
        }),
      },
      {
        text: "Redo",
        disabled: !this.history.undoStack.canRedo,
        shortcut: [
          new KeyGesture(["Command", "Shift"], "KeyZ"),
          new KeyGesture(["Command"], "KeyY"),
        ],
        run: action(() => {
          this.history.undoStack.redo();
          return true;
        }),
      },
    ];
  }

  getMainMenu(): MenuItem[] {
    return [
      {
        text: "Edit",
        children: this.getEditMenu(),
      },
    ];
  }

  handleGlobalKeyDown(e: KeyboardEvent): boolean {
    switch (e.key) {
      case "Escape":
        // TODO
        break;
      case "Alt":
        this.measureMode = true;
        break;
      case " ":
        this.panMode = true;
        break;
    }

    // TODO: arrow key movement

    if (e.ctrlKey || e.metaKey || !isTextInputFocused()) {
      if (MenuItem.handleShortcut(this.getMainMenu(), e)) {
        return true;
      }
    }

    return false;
  }

  handleGlobalKeyUp(e: KeyboardEvent): void {
    switch (e.key) {
      case "Alt":
        this.measureMode = false;
        break;
      case " ":
        this.panMode = false;
        break;
    }
  }
}
