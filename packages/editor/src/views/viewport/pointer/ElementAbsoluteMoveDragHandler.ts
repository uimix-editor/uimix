import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { Rect, Vec2 } from "paintvec";
import { ElementInstance } from "../../../models/ElementInstance";
import { EditorState } from "../../../state/EditorState";
import { DragHandler } from "./DragHandler";

export class ElementAbsoluteMoveDragHandler implements DragHandler {
  constructor(
    editorState: EditorState,
    overrides: ElementInstance[],
    initPos: Vec2
  ) {
    this.editorState = editorState;
    for (const target of overrides) {
      this.targets.set(target, target.boundingBox);
    }
    this.initWholeBBox = assertNonNull(Rect.union(...this.targets.values()));
    this.initPos = initPos;
  }

  move(event: MouseEvent | DragEvent): void {
    const pos = this.editorState.scroll.documentPosForEvent(event);
    const offset = pos.sub(this.initPos);

    const snappedRect = this.editorState.snapper.snapMoveRect(
      this.initWholeBBox.translate(offset)
    );
    const snappedOffset = snappedRect.topLeft.sub(this.initWholeBBox.topLeft);

    for (const [instance, bbox] of this.targets) {
      const newRect = bbox.translate(snappedOffset);
      instance.resizeWithBoundingBox(newRect, {
        x: true,
        y: true,
      });
    }
  }

  end(event: MouseEvent | DragEvent): void {
    const pos = this.editorState.scroll.documentPosForEvent(event);
    const overridesAtPos = this.editorState.elementPicker.pick(event).all;
    const offset = pos.sub(this.initPos);

    const snappedRect = this.editorState.snapper.snapMoveRect(
      this.initWholeBBox.translate(offset)
    );

    const parent = overridesAtPos.find((dst) => {
      // cannot move inside itself
      if (
        [...this.targets.keys()].some((target) =>
          target.element.includes(dst.element)
        )
      ) {
        return false;
      }

      // cannot move inside a frame that does not fully contain the dragged layers
      const dstRect = dst.boundingBox;
      if (
        !(
          dstRect.includes(snappedRect.topLeft) &&
          dstRect.includes(snappedRect.bottomRight)
        )
      ) {
        return false;
      }

      return true;
    });

    for (const instance of this.targets.keys()) {
      if (instance.parent !== parent) {
        parent?.element.append(instance.element);
      }

      // TODO: adjust position based on new offset parent
    }
    this.editorState.history.commit("Move Layers");
  }

  private readonly editorState: EditorState;
  private readonly targets = new Map<ElementInstance, Rect>();
  private readonly initWholeBBox: Rect;
  private readonly initPos: Vec2;
}
