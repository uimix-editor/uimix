import { Rect, Vec2 } from "paintvec";
import { Selectable } from "../../../models/Selectable";
import { projectState } from "../../../state/ProjectState";
import { DropDestination } from "../../../state/DropDestination";
import { scrollState } from "../../../state/ScrollState";
import { snapper } from "../../../state/Snapper";
import { viewportState } from "../../../state/ViewportState";
import { ViewportEvent } from "./ViewportEvent";
import { DragHandler } from "./DragHandler";
import { assertNonNull } from "../../../utils/Assert";
import { resizeWithBoundingBox } from "../../../services/Resize";

export class NodeMoveDragHandler implements DragHandler {
  constructor(selectables: Selectable[], initPos: Vec2) {
    if (!selectables.length) {
      throw new Error("No elements to move");
    }

    this.initPos = initPos;
    for (const s of selectables) {
      this.targets.set(s, { rect: s.computedRect, absolute: s.isAbsolute });
    }
    const rects = [...this.targets.values()].map(({ rect }) => rect);
    this.initWholeBBox = assertNonNull(Rect.union(...rects));
  }

  move(event: ViewportEvent): void {
    const dst = findDropDestination(event, [...this.targets.keys()]);

    const offset = this.getSnappedOffset(dst.parent, event);

    const dragPreviewRects: Rect[] = [];
    for (const [target, { absolute, rect }] of this.targets) {
      if (absolute) {
        const newRect = rect.translate(offset);
        resizeWithBoundingBox(target, newRect, {
          x: true,
          y: true,
        });
      } else {
        dragPreviewRects.push(rect.translate(offset));
      }
    }

    viewportState.dragPreviewRects = dragPreviewRects;
    viewportState.dropDestination = dst;

    // don't show snappings if all move is relative
    const allRelative = [...this.targets.values()].every(
      ({ absolute }) => !absolute
    );
    if (allRelative && dst.parent.style.layout !== "none") {
      snapper.clear();
    }

    // don't show insertion line if all targets prefer absolute position
    const allPrefersAbsolute = [...this.targets.keys()].every(
      (target) => target.style.absolute
    );
    if (allPrefersAbsolute) {
      viewportState.dropDestination = {
        ...dst,
        shouldShowInsertionLine: false,
      };
    }
  }

  end(event: ViewportEvent): void {
    snapper.clear();
    viewportState.dragPreviewRects = [];
    viewportState.dropDestination = undefined;

    const dst = findDropDestination(event, [...this.targets.keys()]);

    const offset = this.getSnappedOffset(dst.parent, event);

    const selectablesToInsert = [...this.targets].filter(
      ([target, { absolute }]) => {
        // do not move absolute elements that are already inside the destination
        if (absolute && dst.parent === target.parent) {
          return false;
        }
        // don't change parent of component contents (root node and variant nodes)
        if (target.originalNode.parent?.type === "component") {
          return false;
        }

        return true;
      }
    );

    dst.parent.insertBefore(
      dst.ref,
      selectablesToInsert.map(([target]) => target)
    );

    if (dst.parent.style.layout === "none") {
      for (const [target, { rect }] of this.targets) {
        const newRect = rect.translate(offset);
        resizeWithBoundingBox(target, newRect, {
          x: true,
          y: true,
        });
      }
    }

    projectState.undoManager.stopCapturing();
  }

  private getSnappedOffset(parent: Selectable, event: ViewportEvent) {
    const offset = event.pos.sub(this.initPos);
    const snappedRect = snapper.snapMoveRect(
      parent,
      [...this.targets.keys()],
      this.initWholeBBox.translate(offset)
    );
    const snappedOffset = snappedRect.topLeft.sub(this.initWholeBBox.topLeft);
    return snappedOffset;
  }

  private readonly initPos: Vec2;
  private readonly initWholeBBox: Rect;
  private readonly targets = new Map<
    Selectable,
    {
      rect: Rect;
      absolute: boolean;
    }
  >();
}

export function findDropDestination(
  event: ViewportEvent,
  subjects: Selectable[]
): DropDestination {
  const parent = event.selectables.find((dst) => {
    // cannot move inside itself
    if (subjects.some((target) => target.includes(dst))) {
      return false;
    }

    if (!dst.canInsertChild) {
      return false;
    }

    if (dst.parent) {
      const bbox = dst.computedRect;
      const parentBBox = dst.parent.computedRect;

      const parentCloseThresh = scrollState.snapThreshold;
      const threshold = scrollState.snapThreshold * 2;

      // do not drop near the edge when the parent edge is close

      for (const edge of ["left", "top", "right", "bottom"] as const) {
        if (
          Math.abs(bbox[edge] - parentBBox[edge]) < parentCloseThresh &&
          Math.abs(
            bbox[edge] -
              event.pos[edge === "left" || edge === "right" ? "x" : "y"]
          ) < threshold
        ) {
          return false;
        }
      }
    }

    return true;
  });

  if (!parent) {
    return {
      parent: assertNonNull(projectState.page).selectable,
      shouldShowInsertionLine: false,
    };
  }

  const direction = parent.style.stackDirection;
  const inFlowChildren = parent.inFlowChildren;
  const centers = inFlowChildren.map((c) => c.computedRect.center);
  const index = centers.findIndex((c) => c[direction] > event.pos[direction]);
  const shouldShowInsertionLine = parent.style.layout !== "none";
  if (index < 0) {
    return { parent, shouldShowInsertionLine };
  }
  return {
    parent,
    ref: inFlowChildren[index],
    shouldShowInsertionLine,
  };
}
