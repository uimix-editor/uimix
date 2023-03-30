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
      selectablesToInsert.map(([target]) => target),
      dst.ref
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
    };
  }

  const layout = parent.style.layout;

  if (layout === "stack") {
    const direction = parent.style.stackDirection;
    const inFlowChildren = parent.inFlowChildren;
    const centers = inFlowChildren.map((c) => c.computedRect.center);
    const index = centers.findIndex((c) => c[direction] > event.pos[direction]);
    if (index < 0) {
      // append
      const lastRect = inFlowChildren[inFlowChildren.length - 1].computedRect;
      return {
        parent,
        insertionLine:
          direction === "x"
            ? [lastRect.topRight, lastRect.bottomRight]
            : [lastRect.bottomLeft, lastRect.bottomRight],
      };
    }

    if (index === 0) {
      // prepend
      const firstRect = inFlowChildren[0].computedRect;
      return {
        parent,
        ref: inFlowChildren[0],
        insertionLine:
          direction === "x"
            ? [firstRect.topLeft, firstRect.bottomLeft]
            : [firstRect.topLeft, firstRect.topRight],
      };
    }

    const prev = inFlowChildren[index - 1];
    const next = inFlowChildren[index];
    const prevRect = prev.computedRect;
    const nextRect = next.computedRect;

    return {
      parent,
      ref: next,
      insertionLine:
        direction === "x"
          ? [
              prevRect.topRight.add(nextRect.topLeft).mulScalar(0.5),
              prevRect.bottomRight.add(nextRect.bottomLeft).mulScalar(0.5),
            ]
          : [
              prevRect.bottomLeft.add(nextRect.topLeft).mulScalar(0.5),
              prevRect.bottomRight.add(nextRect.topRight).mulScalar(0.5),
            ],
    };
  }

  if (layout === "grid") {
    // TODO: when column count is 1, use the same logic as vertical stack

    const inFlowChildren = parent.inFlowChildren;
    const columnCount = parent.style.gridColumnCount ?? 1;
    const rowCount = Math.ceil(inFlowChildren.length / columnCount);

    let nextChild: Selectable | undefined;
    let insertionLine: [Vec2, Vec2] | undefined;

    for (let row = 0; row < rowCount; row++) {
      const rowChildren = inFlowChildren.slice(
        row * columnCount,
        (row + 1) * columnCount
      );
      const rowChildrenBottom = Math.max(
        ...rowChildren.map((c) => c.computedRect.bottom)
      );
      if (event.pos.y > rowChildrenBottom) {
        continue;
      }

      for (const child of rowChildren) {
        if (child.computedRect.center.x > event.pos.x) {
          nextChild = child;
          break;
        }
      }
      nextChild = nextChild ?? rowChildren[rowChildren.length - 1].nextSibling;
      if (nextChild) {
        insertionLine = [
          nextChild.computedRect.topLeft,
          nextChild.computedRect.bottomLeft,
        ];
      }
      break;
    }

    if (!insertionLine) {
      const lastChild = inFlowChildren[inFlowChildren.length - 1];
      insertionLine = [
        lastChild.computedRect.topRight,
        lastChild.computedRect.bottomRight,
      ];
    }

    return {
      parent,
      ref: nextChild,
      insertionLine: insertionLine,
    };
  }

  // no layout
  return { parent };
}
