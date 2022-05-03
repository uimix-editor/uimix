import { Vec2 } from "paintvec";
import { ElementInstance } from "../../../models/ElementInstance";
import { ElementPicker, ElementPickResult } from "../../../mount/ElementPicker";
import { EditorState } from "../../../state/EditorState";
import { dragStartThreshold } from "../Constants";
import { DragHandler } from "./DragHandler";
import { ElementMoveDragHandler } from "./ElementMoveDragHandler";

export class ElementClickMoveDragHandler implements DragHandler {
  static create(
    editorState: EditorState,
    picker: ElementPicker,
    pickResult: ElementPickResult,
    event: MouseEvent | DragEvent,
    doubleClick?: boolean
  ): ElementClickMoveDragHandler | undefined {
    const pos = editorState.scroll.documentPosForEvent(event);
    const override = doubleClick
      ? pickResult.doubleClickable
      : pickResult.default;

    if (override) {
      return new ElementClickMoveDragHandler(
        editorState,
        picker,
        pos,
        override,
        pickResult.all,
        event.shiftKey
      );
    }
  }

  constructor(
    editorState: EditorState,
    picker: ElementPicker,
    pos: Vec2,
    override: ElementInstance,
    overridesAtPos: readonly ElementInstance[],
    additive: boolean
  ) {
    this.editorState = editorState;
    this.picker = picker;
    this.initPos = pos;
    this.override = override;
    this.overridesAtInitialPos = overridesAtPos;
    this.additive = additive;

    if (this.overridesAtInitialPos.every((o) => !o.ancestorSelected)) {
      if (!this.additive) {
        this.editorState.document.deselect();
      }
      this.override.select();
    }
  }

  move(event: MouseEvent | DragEvent): void {
    const pos = this.editorState.scroll.documentPosForEvent(event);

    const offset = pos.sub(this.initPos);
    if (!this.handler) {
      if (offset.length < dragStartThreshold) {
        return;
      }

      this.handler = new ElementMoveDragHandler(
        this.editorState,
        this.picker,
        this.editorState.document.selectedElementInstances,
        this.initPos
      );
    }

    this.handler.move(event);
  }

  end(event: MouseEvent | DragEvent): void {
    this.handler?.end(event);
    if (!this.handler) {
      // do click
      if (!this.additive) {
        this.editorState.document.deselect();
      }
      this.override.select();
    }
  }

  private readonly editorState: EditorState;
  private readonly picker: ElementPicker;
  private readonly initPos: Vec2;
  private readonly override: ElementInstance;
  private readonly overridesAtInitialPos: readonly ElementInstance[];
  private readonly additive: boolean;
  private handler: ElementMoveDragHandler | undefined;
}
