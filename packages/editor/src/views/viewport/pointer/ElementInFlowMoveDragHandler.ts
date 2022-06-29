import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { Rect, Vec2 } from "paintvec";
import { ElementInstance } from "../../../models/ElementInstance";
import { TextInstance } from "../../../models/TextInstance";
import { ElementPickResult } from "../../../mount/ElementPicker";
import { EditorState } from "../../../state/EditorState";
import { DragHandler } from "./DragHandler";

export class ElementInFlowMoveDragHandler implements DragHandler {
  constructor(
    editorState: EditorState,
    overrides: ElementInstance[],
    initPos: Vec2
  ) {
    if (!overrides.length) {
      throw new Error("No elements to move");
    }

    this.editorState = editorState;
    this.initPos = initPos;
    for (const o of overrides) {
      this.targets.set(o, o.boundingBox);
    }
  }

  move(event: MouseEvent | DragEvent): void {
    const pickResult = this.editorState.elementPicker.pick(event);

    const offset = pickResult.pos.sub(this.initPos);

    this.editorState.dragPreviewRects = [...this.targets.values()].map((rect) =>
      rect.translate(offset)
    );

    const { parent: newParent, ref: newRef } = findDropDestination(
      this.editorState,
      pickResult,
      [...this.targets.keys()]
    );

    if (newParent) {
      this.editorState.dropTargetPreviewRect = newParent.boundingBox;
      this.editorState.dropIndexIndicator = dropDestinationIndicator(
        newParent,
        newRef
      );
    }
  }

  end(event: MouseEvent | DragEvent): void {
    this.editorState.snapper.clear();
    this.editorState.dragPreviewRects = [];
    this.editorState.dropTargetPreviewRect = undefined;
    this.editorState.dropIndexIndicator = undefined;

    const { parent: newParent, ref: newRef } = findDropDestination(
      this.editorState,
      this.editorState.elementPicker.pick(event),
      [...this.targets.keys()]
    );
    if (!newParent) {
      return;
    }

    TreeNode.moveNodes(
      newParent.element,
      newRef ? newRef.node : undefined,
      [...this.targets.keys()].map((o) => o.node)
    );
    this.editorState.history.commit("Move Layer");
  }

  private readonly editorState: EditorState;
  private readonly initPos: Vec2;
  private readonly targets = new Map<ElementInstance, Rect>();
}

export function findDropDestination(
  editorState: EditorState,
  pickResult: ElementPickResult,
  subjects: ElementInstance[]
): {
  parent?: ElementInstance | undefined;
  ref?: ElementInstance | TextInstance | undefined;
} {
  const parent = pickResult.all.find((dst) => {
    // cannot move inside itself
    if (subjects.some((target) => target.element.includes(dst.element))) {
      return false;
    }

    if (dst.parent) {
      const bbox = dst.boundingBox;
      const parentBBox = dst.parent.boundingBox;

      const parentCloseThresh = editorState.snapThreshold;
      const threshold = editorState.snapThreshold * 2;

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
    return {};
  }

  const direction = parent.layoutDirection;
  const inFlowChildren = parent.inFlowChildren;
  const centers = inFlowChildren.map((c) => c.boundingBox.center);
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

function dropDestinationIndicator(
  parent: ElementInstance,
  ref: ElementInstance | TextInstance | undefined
): [Vec2, Vec2] | undefined {
  const direction = parent.layoutDirection;
  const inFlowChildren = parent.inFlowChildren;

  let index = inFlowChildren.findIndex((o) => o === ref);
  if (index < 0) {
    index = inFlowChildren.length;
  }

  const parentRect = parent.boundingBox;
  const parentPaddings = parent.computedPaddings;

  if (direction === "x") {
    let x: number;

    if (index === 0) {
      x = parentRect.left + parentPaddings.left;
    } else if (index === inFlowChildren.length) {
      const prev = inFlowChildren[index - 1];
      x = prev.boundingBox.right;
    } else {
      const prev = inFlowChildren[index - 1];
      const next = inFlowChildren[index];
      x = (prev.boundingBox.right + next.boundingBox.left) / 2;
    }

    const y1 = parentRect.top + parentPaddings.top;
    const y2 = parentRect.bottom - parentPaddings.bottom;

    return [new Vec2(x, y1), new Vec2(x, y2)];
  } else {
    let y: number;

    if (index === 0) {
      y = parentRect.top + parentPaddings.top;
    } else if (index === inFlowChildren.length) {
      const prev = inFlowChildren[index - 1];
      y = prev.boundingBox.bottom;
    } else {
      const prev = inFlowChildren[index - 1];
      const next = inFlowChildren[index];
      y = (prev.boundingBox.bottom + next.boundingBox.top) / 2;
    }

    const x1 = parentRect.left + parentPaddings.left;
    const x2 = parentRect.right - parentPaddings.right;

    return [new Vec2(x1, y), new Vec2(x2, y)];
  }
}
