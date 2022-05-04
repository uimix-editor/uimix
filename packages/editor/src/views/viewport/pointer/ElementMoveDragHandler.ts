import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { compact } from "lodash-es";
import { Rect, Vec2 } from "paintvec";
import { ElementInstance } from "../../../models/ElementInstance";
import { TextInstance } from "../../../models/TextInstance";
import { EditorState } from "../../../state/EditorState";
import { DragHandler } from "./DragHandler";

export class ElementMoveDragHandler implements DragHandler {
  constructor(
    editorState: EditorState,
    overrides: ElementInstance[],
    initPos: Vec2
  ) {
    this.editorState = editorState;
    this.initPos = initPos;
    this.overrides = overrides;
    for (const o of this.overrides) {
      this._initData.set(o, {
        rect: o.offsetBoundingBox,
        absoluteRect: o.boundingBox,
      });
    }

    this.absoluteTargets = [];
    this.staticTargets = [];
    for (const override of this.overrides) {
      if (override.computedStyle.position !== "absolute") {
        this.staticTargets.push(override);
      } else {
        this.absoluteTargets.push(override);
      }
    }
  }

  move(event: MouseEvent | DragEvent): void {
    const pos = this.editorState.scroll.documentPosForEvent(event);
    const overridesAtPos = this.editorState.elementPicker.pick(event).all;

    const offset = pos.sub(this.initPos);

    if (this.absoluteTargets.length) {
      // Absolute move
      const absoluteInitBoundingRect = assertNonNull(
        Rect.union(
          ...this.absoluteTargets.map((o) => this.initData(o).absoluteRect)
        )
      );

      const snappedRect = this.editorState.snapper.snapMoveRect(
        absoluteInitBoundingRect.translate(offset)
      );
      const snappedOffset = snappedRect.topLeft.sub(
        absoluteInitBoundingRect.topLeft
      );

      for (const instance of this.absoluteTargets) {
        const newRect =
          this.initData(instance).absoluteRect.translate(snappedOffset);
        instance.resizeWithBoundingBox(newRect, {
          x: true,
          y: true,
        });
      }
    }

    this.editorState.dragPreviewRects = this.staticTargets.map((target) =>
      this.initData(target).absoluteRect.translate(offset)
    );

    if (this.overrides.length > 0) {
      const { parent: newParent, ref: newRef } = this.newParent(
        pos,
        overridesAtPos
      );

      if (newParent) {
        this.editorState.dropTargetPreviewRect = newParent.boundingBox;

        if (
          newRef !== false &&
          (this.overrides.some((layer) => layer.parent !== newParent) ||
            this.staticTargets.length)
        ) {
          this.editorState.dropIndexIndicator = dropIndexIndicator(
            newParent,
            newRef
          );
          this.editorState.snapper.clear();
        } else {
          this.editorState.dropIndexIndicator = undefined;
        }
      }
    }
  }

  end(event: MouseEvent | DragEvent): void {
    const pos = this.editorState.scroll.documentPosForEvent(event);
    const overridesAtPos = this.editorState.elementPicker.pick(event).all;

    if (this.overrides.length > 0) {
      // Move layers to new parent
      const { parent: newParent, ref: newRef } = this.newParent(
        pos,
        overridesAtPos
      );
      if (newParent) {
        const parentChangedLayers = this.overrides.filter(
          (layer) => layer.parent !== newParent
        );
        if (parentChangedLayers.length) {
          // TODO: Set position of moved layers

          // const parentOverride = newParent.override;
          // for (const layer of parentChangedLayers) {
          //   const override = layer.override;

          //   const offset = pos.sub(this.initPos);
          //   const newRect = this.editorState.snapper
          //     .snapMoveRect(
          //       this.initData(override).absoluteRect.translate(offset)
          //     )
          //     .translate(
          //       parentOverride.layout.absoluteTopLeft.add(
          //         new Vec2(
          //           parentOverride.layout.borderLeftWidth,
          //           parentOverride.layout.borderTopWidth
          //         )
          //       ).neg
          //     );

          //   override.updateConstraints({
          //     rect: newRect,
          //     xConstraintType: "start",
          //     yConstraintType: "start",
          //   });
          // }

          TreeNode.moveNodes(
            newParent.element,
            newRef ? newRef.node : undefined,
            this.overrides.map((o) => o.node)
          );
        } else if (newRef !== false) {
          TreeNode.moveNodes(
            newParent.element,
            newRef ? newRef.node : undefined,
            compact(this.staticTargets.map((o) => o.node))
          );
        }
      }
    }

    this.editorState.history.commit("Move Layer");
    this.editorState.snapper.clear();
    this.editorState.dragPreviewRects = [];
    this.editorState.dropTargetPreviewRect = undefined;
    this.editorState.dropIndexIndicator = undefined;
  }

  private newParent(
    pos: Vec2,
    overridesAtPos: readonly ElementInstance[]
  ): {
    parent: ElementInstance | undefined;
    ref: ElementInstance | TextInstance | undefined | false; // false if the parent is not a stack
  } {
    if (this.overrides.length === 0) {
      throw new Error("No layers to move");
    }

    // let absoluteBBox = assertNonNull(
    //   Rect.union(
    //     ...this.overrides.map((layer) => this.initData(layer).absoluteRect)
    //   )
    // ).translate(pos.sub(this.initPos));
    // absoluteBBox = this.editorState.snapper.snapMoveRect(absoluteBBox);

    const parent = overridesAtPos.find((dst) => {
      // cannot move inside itself
      if (
        this.overrides.some((target) => target.element.includes(dst.element))
      ) {
        return false;
      }

      // // cannot move inside a frame that does not fully contain the dragged layers
      // const dstRect = dst.boundingBox;
      // if (
      //   dst.type === "frame" &&
      //   !(
      //     dstRect.includes(absoluteBBox.topLeft) &&
      //     dstRect.includes(absoluteBBox.bottomRight)
      //   )
      // ) {
      //   return false;
      // }

      return true;
    });

    if (!parent) {
      return { parent, ref: false };
    }

    const direction = layoutDirection(parent);
    const staticChildren = getStaticChildren(parent);
    const centers = staticChildren.map((c) => c.boundingBox.center);
    const index = centers.findIndex((c) => c[direction] > pos[direction]);
    if (index < 0) {
      return { parent, ref: undefined };
    }
    return {
      parent,
      ref: staticChildren[index],
    };
  }

  private initData(override: ElementInstance): {
    rect: Rect;
    absoluteRect: Rect;
  } {
    return assertNonNull(this._initData.get(override));
  }

  private readonly editorState: EditorState;
  private readonly initPos: Vec2;
  private overrides: ElementInstance[];
  private absoluteTargets: ElementInstance[];
  private staticTargets: ElementInstance[];
  private _initData = new Map<
    ElementInstance,
    {
      rect: Rect;
      absoluteRect: Rect;
    }
  >();
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

function getStaticChildren(
  parent: ElementInstance
): (ElementInstance | TextInstance)[] {
  return parent.children.filter((o) =>
    o.type === "element"
      ? ["relative", "static"].includes(o.computedStyle.position ?? "")
      : true
  );
}

function dropIndexIndicator(
  parent: ElementInstance,
  ref: ElementInstance | TextInstance | undefined
): [Vec2, Vec2] | undefined {
  const direction = layoutDirection(parent);
  const staticChildren = getStaticChildren(parent);

  let index = staticChildren.findIndex((o) => o === ref);
  if (index < 0) {
    index = staticChildren.length;
  }

  const parentRect = parent.boundingBox;
  const parentPaddings = parent.computedPaddings;

  if (direction === "x") {
    let x: number;

    if (index === 0) {
      x = parentRect.left + parentPaddings.left;
    } else if (index === staticChildren.length) {
      x = parentRect.right - parentPaddings.right;
    } else {
      const prev = staticChildren[index - 1];
      const next = staticChildren[index];
      x = (prev.boundingBox.right + next.boundingBox.left) / 2;
    }

    const y1 = parentRect.top + parentPaddings.top;
    const y2 = parentRect.bottom - parentPaddings.bottom;

    return [new Vec2(x, y1), new Vec2(x, y2)];
  } else {
    let y: number;

    if (index === 0) {
      y = parentRect.top + parentPaddings.top;
    } else if (index === staticChildren.length) {
      y = parentRect.bottom - parentPaddings.bottom;
    } else {
      const prev = staticChildren[index - 1];
      const next = staticChildren[index];
      y = (prev.boundingBox.bottom + next.boundingBox.top) / 2;
    }

    const x1 = parentRect.left + parentPaddings.left;
    const x2 = parentRect.right - parentPaddings.right;

    return [new Vec2(x1, y), new Vec2(x2, y)];
  }
}
