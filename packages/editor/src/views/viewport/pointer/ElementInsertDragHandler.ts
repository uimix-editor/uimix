import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { Rect, Vec2 } from "paintvec";
import { Component } from "../../../models/Component";
import { Element } from "../../../models/Element";
import { ElementInstance } from "../../../models/ElementInstance";
import { getInstance } from "../../../models/InstanceRegistry";
import { Text } from "../../../models/Text";
import { ElementPickResult } from "../../../mount/ElementPicker";
import { EditorState } from "../../../state/EditorState";
import { InsertMode } from "../../../state/InsertMode";
import { dragStartThreshold } from "../Constants";
import { DragHandler } from "./DragHandler";

export class ElementInsertDragHandler implements DragHandler {
  constructor(
    editorState: EditorState,
    mode: InsertMode,
    pickResult: ElementPickResult
  ) {
    this.editorState = editorState;
    this.mode = mode;

    this.initClientPos = new Vec2(
      pickResult.event.clientX,
      pickResult.event.clientY
    );
    this.initPos = editorState.snapper.snapInsertPoint(
      editorState.scroll.documentPosForEvent(pickResult.event)
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
    } else {
      const element = new Element({ tagName: "div" });
      element.rename("div");

      if (mode === "text") {
        element.append(new Text({ content: "Type something" }));
      }

      parent.element.append(element);
      this.instance = getInstance(parent.variant, element);
      this.instance.style.position = "absolute";
      if (mode !== "text") {
        this.instance.style.background = "#cccccc";
      }
    }

    this.instance.resizeWithBoundingBox(
      Rect.boundingRect([this.initPos, this.initPos]),
      {
        x: true,
        y: true,
      }
    );

    this.editorState.document.deselect();
    this.instance.select();
  }

  move(event: MouseEvent | DragEvent): void {
    const clientPos = new Vec2(event.clientX, event.clientY);
    if (
      !this.dragStarted &&
      clientPos.sub(this.initClientPos).length < dragStartThreshold
    ) {
      return;
    }
    this.dragStarted = true;

    const pos = this.editorState.snapper.snapResizePoint(
      this.editorState.scroll.documentPosForEvent(event)
    );
    const rect = Rect.boundingRect([pos, this.initPos]);

    this.instance.resizeWithBoundingBox(rect, {
      x: true,
      y: true,
      width: true,
      height: true,
    });
  }

  end(event: MouseEvent | DragEvent): void {
    this.editorState.insertMode = undefined;
    this.editorState.history.commit("Insert component");
  }

  private readonly editorState: EditorState;
  private readonly mode: InsertMode;
  private readonly component: Component | undefined;
  private readonly instance: ElementInstance;
  private readonly initPos: Vec2;
  private readonly initClientPos: Vec2;
  private dragStarted = false;
}
