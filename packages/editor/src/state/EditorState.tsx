import { MenuItem } from "@seanchas116/paintkit/src/components/menu/Menu";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { isTextInputFocused } from "@seanchas116/paintkit/src/util/CurrentFocus";
import { Scroll } from "@seanchas116/paintkit/src/util/Scroll";
import { action, computed, makeObservable, observable } from "mobx";
import { Rect, Vec2 } from "paintvec";
import { SelectItem } from "@seanchas116/paintkit/src/components/Select";
import { isVoidElement } from "@seanchas116/paintkit/src/util/HTMLTagCategory";
import googleFonts from "@seanchas116/paintkit/src/util/GoogleFonts.json";
import { Component } from "../models/Component";
import { Document, DocumentJSON } from "../models/Document";
import { Element } from "../models/Element";
import { ElementInstance } from "../models/ElementInstance";
import { Text } from "../models/Text";
import { TextInstance } from "../models/TextInstance";
import { Variant } from "../models/Variant";
import { ElementPicker } from "../mount/ElementPicker";
import { snapThreshold } from "../views/viewport/Constants";
import { IconBrowserState } from "../views/sidebar/outline/IconBrowserState";
import { moveByPixels } from "../services/MoveByPixels";
import { ElementInspectorState } from "./ElementInspectorState";
import { VariantInspectorState } from "./VariantInspectorState";
import { InsertMode } from "./InsertMode";
import { ElementSnapper } from "./ElementSnapper";
import { Commands } from "./Commands";

export abstract class EditorState {
  constructor() {
    makeObservable(this);
  }

  abstract get history(): JSONUndoHistory<DocumentJSON, Document>;

  get document(): Document {
    return this.history.target;
  }

  /**
   * Overridable
   * @returns the paths of available image assets (relative from the dirname of the current file)
   */
  get imageAssets(): readonly string[] {
    return [];
  }

  resolveImageAssetURL(assetPath: string): string {
    return assetPath;
  }

  readonly googleFontFamilies = googleFonts.items.map((item) => item.family);

  @observable currentOutlineTab: "outline" | "assets" = "outline";
  @observable currentInspectorTab: "element" | "style" = "element";
  @observable assetTab: "components" | "images" | "icons" = "components";
  @observable sideBarSplitRatio = 0.3;
  @observable sideBarWidth = 256;

  readonly variantInspectorState = new VariantInspectorState(this);
  readonly elementInspectorState = new ElementInspectorState(this);

  readonly scroll = new Scroll();

  @observable hoveredItem: ElementInstance | TextInstance | undefined =
    undefined;

  @observable innerHTMLEditTarget: ElementInstance | undefined = undefined;

  @computed get hoveredRect(): Rect | undefined {
    if (!this.hoveredItem) {
      return;
    }
    switch (this.hoveredItem.type) {
      case "element":
        return this.hoveredItem.boundingBox;
      case "text":
        return this.hoveredItem.parent?.boundingBox;
    }
  }

  @observable measureMode = false;
  @observable panMode = false;

  @observable insertMode: InsertMode | undefined = undefined;

  @observable resizeBoxVisible = true;

  @observable.ref dragPreviewRects: readonly Rect[] = [];
  @observable.ref dropTargetPreviewRect: Rect | undefined = undefined;
  @observable.ref dropIndexIndicator: readonly [Vec2, Vec2] | undefined =
    undefined;

  readonly elementPicker = new ElementPicker(this);
  readonly snapper = new ElementSnapper(this);

  readonly commands = new Commands(this);

  readonly iconBrowserState = new IconBrowserState();

  get snapThreshold(): number {
    return snapThreshold / this.scroll.scale;
  }

  getBasicEditMenu(): MenuItem[] {
    return [
      this.commands.cut,
      this.commands.copy,
      this.commands.paste,
      this.commands.delete,
    ];
  }

  getRootContextMenu(): MenuItem[] {
    return [
      {
        text: "Add Component",
        onClick: action(() => {
          const component = new Component();
          this.document.components.append(component);
          this.history.commit("Add Component");
          return true;
        }),
      },
      {
        type: "separator",
      },
      this.commands.paste,
    ];
  }

  getComponentContextMenu(component: Component): MenuItem[] {
    return [
      {
        text: "Add Variant",
        onClick: action(() => {
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
      ...(!isVoidElement(instance.element.tagName)
        ? ([
            {
              text: "Edit Inner HTML",
              onClick: action(() => {
                this.innerHTMLEditTarget = instance;
                return true;
              }),
            },
            {
              type: "separator",
            },
          ] as MenuItem[])
        : []),
      {
        text: "Add Element",
        onClick: action(() => {
          const element = new Element({ tagName: "div" });
          element.rename("div");
          instance.element.append(element);
          this.history.commit("Add Element");
          return true;
        }),
      },
      {
        text: "Add Text",
        onClick: action(() => {
          const text = new Text({ content: "Text" });
          instance.element.append(text);
          this.history.commit("Add Text");
          return true;
        }),
      },
      {
        type: "separator",
      },
      ...this.getElementMenu(),
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
      this.commands.undo,
      this.commands.redo,
      {
        type: "separator",
      },
      ...this.getBasicEditMenu(),
    ];
  }

  getElementMenu(): MenuItem[] {
    return [this.commands.groupIntoFlex, this.commands.autoLayoutChildren];
  }

  getViewMenu(): MenuItem[] {
    return [this.commands.zoomIn, this.commands.zoomOut];
  }

  getMainMenu(): MenuItem[] {
    return [
      {
        text: "Edit",
        children: this.getEditMenu(),
      },
      {
        text: "Element",
        children: this.getElementMenu(),
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
        this.insertMode = undefined;
        this.innerHTMLEditTarget = undefined;
        break;
      case "Alt":
        this.measureMode = true;
        break;
      case " ":
        this.panMode = true;
        break;
    }

    if (!isTextInputFocused()) {
      const moveInstancesByPixels = (offset: Vec2) => {
        for (const instance of this.document.selectedElementInstances) {
          moveByPixels(instance, offset);
        }
        this.history.commitDebounced("Move Elements");
      };

      switch (e.key) {
        case "ArrowLeft":
          moveInstancesByPixels(new Vec2(-1, 0));
          return true;
        case "ArrowRight":
          moveInstancesByPixels(new Vec2(1, 0));
          return true;
        case "ArrowUp":
          moveInstancesByPixels(new Vec2(0, -1));
          return true;
        case "ArrowDown":
          moveInstancesByPixels(new Vec2(0, 1));
          return true;
      }
    }

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

  @computed get imageURLOptions(): SelectItem[] {
    return this.imageAssets.map((file) => ({
      value: file,
      text: file,
      icon: (
        <img
          style={{
            width: "20px",
            height: "20px",
            objectFit: "contain",
          }}
          loading="lazy"
          src={this.resolveImageAssetURL(file)}
        />
      ),
    }));
  }
}
