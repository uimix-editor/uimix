import { Rect, Vec2 } from "paintvec";
import { Selectable } from "../../../models/Selectable";
import { projectState } from "../../../state/ProjectState";
import { DropDestination } from "../../../state/DropDestination";
import { scrollState } from "../../../state/ScrollState";
import { snapper } from "../../../state/Snapper";
import { viewportState } from "../../../state/ViewportState";
import { NodePickResult } from "../renderer/NodePicker";
import { DragHandler } from "./DragHandler";
import { assertNonNull } from "../../../utils/Assert";

export class NodeInFlowMoveDragHandler implements DragHandler {
  constructor(overrides: Selectable[], initPos: Vec2) {
    if (!overrides.length) {
      throw new Error("No elements to move");
    }

    this.initPos = initPos;
    for (const o of overrides) {
      this.targets.set(o, o.computedRect);
    }
  }

  move(pickResult: NodePickResult): void {
    const offset = pickResult.pos.sub(this.initPos);

    viewportState.dragPreviewRects = [...this.targets.values()].map((rect) =>
      rect.translate(offset)
    );

    const dst = findDropDestination(pickResult, [...this.targets.keys()]);
    viewportState.dropDestination = dst;
  }

  end(pickResult: NodePickResult): void {
    snapper.clear();
    viewportState.dragPreviewRects = [];
    viewportState.dropDestination = undefined;

    const dst = findDropDestination(pickResult, [...this.targets.keys()]);
    if (!dst) {
      return;
    }

    dst.parent.insertBefore(dst.ref, [...this.targets.keys()]);
    projectState.undoManager.stopCapturing();
  }

  private readonly initPos: Vec2;
  private readonly targets = new Map<Selectable, Rect>();
}

export function findDropDestination(
  pickResult: NodePickResult,
  subjects: Selectable[]
): DropDestination | undefined {
  const parent = pickResult.all.find((dst) => {
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
              pickResult.pos[edge === "left" || edge === "right" ? "x" : "y"]
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

  const direction = parent.style.stackDirection;
  const inFlowChildren = parent.inFlowChildren;
  const centers = inFlowChildren.map((c) => c.computedRect.center);
  const index = centers.findIndex(
    (c) => c[direction] > pickResult.pos[direction]
  );
  if (index < 0) {
    return { parent };
  }
  return {
    parent,
    ref: inFlowChildren[index],
  };
}
