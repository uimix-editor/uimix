import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { Rect, Vec2 } from "paintvec";
import { Component } from "../../../models/Component";
import { ElementInstance } from "../../../models/ElementInstance";
import { ElementPickResult } from "../../../mount/ElementPicker";
import { EditorState } from "../../../state/EditorState";
import { DragHandler } from "./DragHandler";

export class ElementInsertDragHandler implements DragHandler {
  constructor(editorState: EditorState, pickResult: ElementPickResult) {
    this.editorState = editorState;
    this.initPos = editorState.scroll.documentPosForEvent(pickResult.event);

    this.component = new Component();
    this.component.rename("my-component");
    this.editorState.document.components.append(this.component);

    this.instance = assertNonNull(this.component.defaultVariant.rootInstance);

    this.component.defaultVariant.x = this.initPos.x;
    this.component.defaultVariant.y = this.initPos.y;
  }

  move(event: MouseEvent | DragEvent): void {
    const pos = this.editorState.scroll.documentPosForEvent(event);
    const rect = Rect.boundingRect([pos, this.initPos]);

    this.component.defaultVariant.x = rect.left;
    this.component.defaultVariant.y = rect.top;
    this.component.defaultVariant.width = rect.width;
    this.component.defaultVariant.height = rect.height;
  }
  end(event: MouseEvent | DragEvent): void {
    // TODO

    this.editorState.insertMode = undefined;
    this.editorState.history.commit("Insert component");
  }

  private readonly editorState: EditorState;
  private readonly initPos: Vec2;
  private readonly component: Component;
  private readonly instance: ElementInstance;
}
