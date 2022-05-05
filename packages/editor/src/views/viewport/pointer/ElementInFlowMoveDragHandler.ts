import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { Rect, Vec2 } from "paintvec";
import { ElementInstance } from "../../../models/ElementInstance";
import { TextInstance } from "../../../models/TextInstance";
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
    const pos = this.editorState.scroll.documentPosForEvent(event);
    const overridesAtPos = this.editorState.elementPicker.pick(event).all;

    const offset = pos.sub(this.initPos);

    this.editorState.dragPreviewRects = [...this.targets.values()].map((rect) =>
      rect.translate(offset)
    );

    const { parent: newParent, ref: newRef } = this.newParent(
      pos,
      overridesAtPos
    );

    if (newParent) {
      this.editorState.dropTargetPreviewRect = newParent.boundingBox;
      this.editorState.dropIndexIndicator = dropIndexIndicator(
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

    const pos = this.editorState.scroll.documentPosForEvent(event);
    const overridesAtPos = this.editorState.elementPicker.pick(event).all;

    const { parent: newParent, ref: newRef } = this.newParent(
      pos,
      overridesAtPos
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

  private newParent(
    pos: Vec2,
    overridesAtPos: readonly ElementInstance[]
  ): {
    parent?: ElementInstance | undefined;
    ref?: ElementInstance | TextInstance | undefined;
  } {
    const parent = overridesAtPos.find((dst) => {
      // cannot move inside itself
      if (
        [...this.targets.keys()].some((target) =>
          target.element.includes(dst.element)
        )
      ) {
        return false;
      }

      if (dst.parent) {
        const distanceFroEdge = Math.min(
          Math.abs(dst.boundingBox.top - pos.y),
          Math.abs(dst.boundingBox.bottom - pos.y),
          Math.abs(dst.boundingBox.left - pos.x),
          Math.abs(dst.boundingBox.right - pos.x)
        );
        if (distanceFroEdge < this.editorState.snapThreshold * 2) {
          return false;
        }
      }

      return true;
    });

    if (!parent) {
      return {};
    }

    const direction = layoutDirection(parent);
    const inFlowChildren = getInFlowChildren(parent);
    const centers = inFlowChildren.map((c) => c.boundingBox.center);
    const index = centers.findIndex((c) => c[direction] > pos[direction]);
    if (index < 0) {
      return { parent };
    }
    return {
      parent,
      ref: inFlowChildren[index],
    };
  }

  private readonly editorState: EditorState;
  private readonly initPos: Vec2;
  private readonly targets = new Map<ElementInstance, Rect>();
}

function layoutDirection(parent: ElementInstance): "x" | "y" {
  if (
    parent.computedStyle.display?.includes("flex") &&
    parent.computedStyle.flexDirection === "row"
  ) {
    return "x";
  } else {
    return "y";
  }
}

function getInFlowChildren(
  parent: ElementInstance
): (ElementInstance | TextInstance)[] {
  return parent.children.filter((o) => o.inFlow);
}

function dropIndexIndicator(
  parent: ElementInstance,
  ref: ElementInstance | TextInstance | undefined
): [Vec2, Vec2] | undefined {
  const direction = layoutDirection(parent);
  const inFlowChildren = getInFlowChildren(parent);

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
      x = parentRect.right - parentPaddings.right;
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
      y = parentRect.bottom - parentPaddings.bottom;
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
