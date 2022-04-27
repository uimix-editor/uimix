import { MenuItem } from "@seanchas116/paintkit/dist/components/menu/Menu";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { KeyGesture } from "@seanchas116/paintkit/src/util/KeyGesture";
import { isTextInputFocused } from "@seanchas116/paintkit/src/util/CurrentFocus";
import { Scroll } from "@seanchas116/paintkit/src/util/Scroll";
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

  readonly scroll = new Scroll();

  @observable hoveredItem: ElementInstance | TextInstance | undefined =
    undefined;

  @observable measureMode = false;
  @observable panMode = false;

  getBasicEditMenu(): MenuItem[] {
    return [
      {
        text: "Cut",
        shortcut: [new KeyGesture(["Command"], "KeyX")],
        // TODO
      },
      {
        text: "Copy",
        shortcut: [new KeyGesture(["Command"], "KeyC")],
        // TODO
      },
      {
        text: "Paste",
        shortcut: [new KeyGesture(["Command"], "KeyV")],
        // TODO
      },
      {
        text: "Delete",
        shortcut: [new KeyGesture([], "Backspace")],
        run: action(() => {
          this.document.deleteSelected();
          this.history.commit("Delete Element");
          return true;
        }),
      },
    ];
  }

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
      {
        type: "separator",
      },
      ...this.getBasicEditMenu(),
    ];
  }

  getComponentContextMenu(component: Component): MenuItem[] {
    return [
      {
        text: "Add Variant",
        run: action(() => {
          const variant = new Variant();
          variant.selector = ":hover";
          component.variants.append(variant);
          return true;
        }),
      },
      {
        type: "separator",
      },
      ...this.getBasicEditMenu(),
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
      {
        type: "separator",
      },
      ...this.getBasicEditMenu(),
    ];
  }

  getTextContextMenu(instance: TextInstance): MenuItem[] {
    return [...this.getBasicEditMenu()];
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
      {
        type: "separator",
      },
      ...this.getBasicEditMenu(),
    ];
  }

  getViewMenu(): MenuItem[] {
    return [
      {
        text: "Zoom In",
        shortcut: [
          new KeyGesture([], "Equal"),
          new KeyGesture([], "NumpadAdd"),
          new KeyGesture(["Command"], "Equal"),
          new KeyGesture(["Command"], "NumpadAdd"),
          new KeyGesture(["Shift"], "Equal"),
          new KeyGesture(["Shift", "Command"], "Equal"),
        ],
        run: action(() => {
          this.scroll.zoomIn();
          return true;
        }),
      },
      {
        text: "Zoom Out",
        shortcut: [
          new KeyGesture([], "Minus"),
          new KeyGesture([], "NumpadSubtract"),
          new KeyGesture(["Command"], "Minus"),
          new KeyGesture(["Command"], "NumpadSubtract"),
          new KeyGesture(["Shift"], "Minus"),
          new KeyGesture(["Shift", "Command"], "Minus"),
        ],
        run: action(() => {
          this.scroll.zoomOut();
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
      {
        text: "View",
        children: this.getViewMenu(),
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
