import { Rect, Vec2 } from "paintvec";
import { Selectable } from "../../../models/Selectable";
import { resizeWithBoundingBox } from "../../../services/Resize";
import { projectState } from "../../../state/ProjectState";
import { snapper } from "../../../state/Snapper";
import { assertNonNull } from "../../../utils/Assert";
import { ViewportEvent } from "./ViewportEvent";
import { DragHandler } from "./DragHandler";

export class NodeAbsoluteMoveDragHandler implements DragHandler {
  constructor(overrides: Selectable[], initPos: Vec2) {
    for (const target of overrides) {
      this.targets.set(target, target.computedRect);
    }
    this.initWholeBBox = assertNonNull(Rect.union(...this.targets.values()));
    this.initPos = initPos;
  }

  move(event: ViewportEvent): void {
    const pos = event.pos;
    const offset = pos.sub(this.initPos);

    const snappedRect = snapper.snapMoveRect(
      this.initWholeBBox.translate(offset)
    );
    const snappedOffset = snappedRect.topLeft.sub(this.initWholeBBox.topLeft);

    for (const [instance, bbox] of this.targets) {
      const newRect = bbox.translate(snappedOffset);
      resizeWithBoundingBox(instance, newRect, {
        x: true,
        y: true,
      });
    }
  }

  end(event: ViewportEvent): void {
    const pos = event.pos;
    const overridesAtPos = event.selectables;
    const offset = pos.sub(this.initPos);

    const snappedRect = snapper.snapMoveRect(
      this.initWholeBBox.translate(offset)
    );

    const parent =
      overridesAtPos.find((dst) => {
        // cannot move inside itself
        if ([...this.targets.keys()].some((target) => target.includes(dst))) {
          return false;
        }

        // cannot move inside a frame that does not fully contain the dragged layers
        const dstRect = dst.computedRect;
        if (
          !(
            dstRect.includes(snappedRect.topLeft) &&
            dstRect.includes(snappedRect.bottomRight)
          )
        ) {
          return false;
        }

        return true;
      }) ?? assertNonNull(projectState.page).selectable;

    for (const [instance] of this.targets) {
      if (
        instance.parent?.node.type !== "component" &&
        instance.parent !== parent
      ) {
        parent.insertBefore(undefined, [instance]);
      }
    }
    projectState.undoManager.stopCapturing();
  }

  private readonly targets = new Map<Selectable, Rect>();
  private readonly initWholeBBox: Rect;
  private readonly initPos: Vec2;
}
