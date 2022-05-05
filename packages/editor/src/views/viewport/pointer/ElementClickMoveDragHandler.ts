import { Vec2 } from "paintvec";
import { ElementInstance } from "../../../models/ElementInstance";
import { ElementPickResult } from "../../../mount/ElementPicker";
import { EditorState } from "../../../state/EditorState";
import { dragStartThreshold } from "../Constants";
import { DragHandler } from "./DragHandler";
import { ElementMoveDragHandler } from "./ElementMoveDragHandler";
import { ElementAbsoluteMoveDragHandler } from "./ElementAbsoluteMoveDragHandler";

export class ElementClickMoveDragHandler implements DragHandler {
  static create(
    editorState: EditorState,
    pickResult: ElementPickResult
  ): ElementClickMoveDragHandler | undefined {
    const override = pickResult.default;
    if (override) {
      return new ElementClickMoveDragHandler(editorState, override, pickResult);
    }
  }

  constructor(
    editorState: EditorState,
    override: ElementInstance,
    pickResult: ElementPickResult
  ) {
    this.editorState = editorState;
    this.initPos = editorState.scroll.documentPosForEvent(pickResult.event);
    this.override = override;
    this.additive = pickResult.event.shiftKey;

    if (pickResult.all.every((o) => !o.ancestorSelected)) {
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

      const absoluteTargets: ElementInstance[] = [];
      const staticTargets: ElementInstance[] = [];
      for (const override of this.editorState.document
        .selectedElementInstances) {
        if (override.computedStyle.position !== "absolute") {
          staticTargets.push(override);
        } else {
          absoluteTargets.push(override);
        }
      }

      if (absoluteTargets.length) {
        this.handler = new ElementAbsoluteMoveDragHandler(
          this.editorState,
          absoluteTargets,
          this.initPos
        );
      } else {
        this.handler = new ElementMoveDragHandler(
          this.editorState,
          staticTargets,
          this.initPos
        );
      }
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
  private readonly initPos: Vec2;
  private readonly override: ElementInstance;
  private readonly additive: boolean;
  private handler: DragHandler | undefined;
}
