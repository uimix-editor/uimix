import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { Rect, Vec2 } from "paintvec";
import { Component } from "../../../models/Component";
import { Element } from "../../../models/Element";
import { ElementInstance } from "../../../models/ElementInstance";
import { Text } from "../../../models/Text";
import { ElementPickResult } from "../../../mount/ElementPicker";
import { EditorState } from "../../../state/EditorState";
import { InsertMode } from "../../../state/InsertMode";
import { DragHandler } from "./DragHandler";

export class ElementInsertDragHandler implements DragHandler {
  constructor(
    editorState: EditorState,
    mode: InsertMode,
    pickResult: ElementPickResult
  ) {
    this.editorState = editorState;
    this.mode = mode;

    const documentPos = editorState.scroll.documentPosForEvent(
      pickResult.event
    );

    const parent = pickResult.default;
    if (!parent) {
      this.component = new Component();
      this.component.rename("my-component");
      this.editorState.document.components.append(this.component);

      if (mode === "text") {
        this.component.rootElement.append(
          new Text({ content: "Type something" })
        );
      }

      this.instance = assertNonNull(this.component.defaultVariant.rootInstance);
      this.parentOffset = new Vec2();
      this.initPos = documentPos;

      this.component.defaultVariant.x = this.initPos.x;
      this.component.defaultVariant.y = this.initPos.y;
    } else {
      const element = new Element({ tagName: "div" });
      element.rename("div");

      if (mode === "text") {
        element.append(new Text({ content: "Type something" }));
      }

      parent.element.append(element);
      this.instance = assertNonNull(
        ElementInstance.get(parent.variant, element)
      );

      this.parentOffset = parent.boundingBox.topLeft; // TODO: use offsetParent
      this.initPos = documentPos.sub(this.parentOffset);

      this.instance.style.position = "absolute";
      this.instance.style.left = `${this.initPos.x}px`;
      this.instance.style.top = `${this.initPos.y}px`;

      if (mode !== "text") {
        this.instance.style.backgroundColor = "#cccccc";
      }
    }

    this.editorState.document.deselect();
    this.instance.select();
  }

  move(event: MouseEvent | DragEvent): void {
    const pos = this.editorState.scroll
      .documentPosForEvent(event)
      .sub(this.parentOffset);
    const rect = Rect.boundingRect([pos, this.initPos]);

    if (this.component) {
      this.component.defaultVariant.x = rect.left;
      this.component.defaultVariant.y = rect.top;
    } else {
      this.instance.style.left = `${rect.left}px`;
      this.instance.style.top = `${rect.top}px`;
    }
    this.instance.style.width = `${rect.width}px`;
    this.instance.style.height = `${rect.height}px`;
  }

  end(event: MouseEvent | DragEvent): void {
    this.editorState.insertMode = undefined;
    this.editorState.history.commit("Insert component");
  }

  private readonly editorState: EditorState;
  private readonly mode: InsertMode;
  private readonly component: Component | undefined;
  private readonly instance: ElementInstance;
  private readonly parentOffset: Vec2;
  private readonly initPos: Vec2;
}
