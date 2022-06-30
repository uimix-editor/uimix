import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { Rect, Vec2 } from "paintvec";
import { ElementInstance } from "../../../models/ElementInstance";
import { ElementPickResult } from "../../../mount/ElementPicker";
import { DropDestination } from "../../../state/DropDestination";
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

    const dst = findDropDestination(this.editorState, pickResult, [
      ...this.targets.keys(),
    ]);
    this.editorState.dropDestination = dst;
  }

  end(event: MouseEvent | DragEvent): void {
    this.editorState.snapper.clear();
    this.editorState.dragPreviewRects = [];
    this.editorState.dropDestination = undefined;

    const dst = findDropDestination(
      this.editorState,
      this.editorState.elementPicker.pick(event),
      [...this.targets.keys()]
    );
    if (!dst) {
      return;
    }

    TreeNode.moveNodes(
      dst.parent.element,
      dst.ref?.node,
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
): DropDestination | undefined {
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
    return;
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
