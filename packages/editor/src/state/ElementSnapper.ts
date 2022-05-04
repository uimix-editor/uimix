import { observable, makeObservable, action } from "mobx";
import { Rect, Vec2 } from "paintvec";
import { compact, debounce } from "lodash-es";
import {
  PointSnapping,
  SameMarginSnapping,
  snapPointToRects,
  snapRectToRects,
} from "@seanchas116/paintkit/src/util/Snapping";
import { snapThreshold } from "../views/viewport/Constants";
import { ElementInstance } from "../models/ElementInstance";
import { EditorState } from "./EditorState";

export class ElementSnapper {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  private get threshold(): number {
    return snapThreshold / this.editorState.scroll.scale;
  }

  private getTargetOverrides(options: {
    selection?: boolean;
    parents?: boolean;
    siblings?: boolean;
    children?: boolean;
  }): Set<ElementInstance> {
    const topLevels = new Set(
      this.editorState.document.components.children.flatMap((c) =>
        compact(c.allVariants.map((v) => v.rootInstance))
      )
    );

    const selection = new Set(
      this.editorState.document.selectedElementInstances
    );
    if (!selection.size) {
      return topLevels;
    }

    const children = new Set<ElementInstance>();

    for (const selected of selection) {
      for (const child of selected.children) {
        if (child.type === "element") {
          children.add(child);
        }
      }
    }

    const parents = new Set<ElementInstance>();
    for (const p of selection) {
      if (p.parent) {
        parents.add(p.parent);
      }
    }

    const siblings = new Set<ElementInstance>();

    for (const parent of parents) {
      for (const child of parent.children) {
        if (child.type === "element" && !child.ancestorSelected) {
          siblings.add(child);
        }
      }
    }

    const topLevelSelected = [...selection].some(
      (selected) => !selected.parent
    );
    if (topLevelSelected) {
      for (const topLevel of topLevels) {
        if (!selection.has(topLevel)) {
          siblings.add(topLevel);
        }
      }
    }

    const result = new Set<ElementInstance>();
    if (options.selection) {
      for (const selected of selection) {
        result.add(selected);
      }
    }
    if (options.parents) {
      for (const parent of parents) {
        result.add(parent);
      }
    }
    if (options.siblings) {
      for (const sibling of siblings) {
        result.add(sibling);
      }
    }

    return result;
  }

  private getResizeTargetOverrides(): Set<ElementInstance> {
    return this.getTargetOverrides({
      parents: true,
      siblings: true,
      children: true,
    });
  }

  private getMoveTargetOverrides(): Set<ElementInstance> {
    return this.getTargetOverrides({
      parents: true,
      siblings: true,
    });
  }

  private getInsertTargetOverrides(): Set<ElementInstance> {
    return this.getTargetOverrides({
      selection: true,
      parents: true,
      siblings: true,
    });
  }

  @observable private _snappings: (PointSnapping | SameMarginSnapping)[] = [];

  private snapPoint(
    targetRects: Rect[],
    point: Vec2,
    axes?: { x?: boolean; y?: boolean }
  ): Vec2 {
    const [point2, snappings] = snapPointToRects(
      targetRects,
      point,
      this.threshold,
      axes
    );
    this._snappings = snappings;
    return point2;
  }

  private snapRect(targetRects: Rect[], rect: Rect): Rect {
    const [rect2, snappings] = snapRectToRects(
      targetRects,
      rect,
      this.threshold
    );
    this._snappings = snappings;
    return rect2;
  }

  private exactSnapRect(targetRects: Rect[], rect: Rect): void {
    const [, snappingsX] = snapRectToRects(targetRects, rect, this.threshold, {
      x: true,
    });
    const [, snappingsY] = snapRectToRects(targetRects, rect, this.threshold, {
      y: true,
    });
    this._snappings = [...snappingsX, ...snappingsY].filter(
      (s) => s.offset === 0
    );
  }

  snapInsertPoint(point: Vec2): Vec2 {
    return this.snapPoint(
      this.rectsForOverrides(this.getInsertTargetOverrides()),
      point
    );
  }

  snapResizePoint(
    point: Vec2,
    axes: { x?: boolean; y?: boolean } = { x: true, y: true }
  ): Vec2 {
    return this.snapPoint(
      this.rectsForOverrides(this.getResizeTargetOverrides()),
      point,
      axes
    );
  }

  snapMoveRect(rect: Rect): Rect {
    return this.snapRect(
      this.rectsForOverrides(this.getMoveTargetOverrides()),
      rect
    );
  }

  exactSnapMoveRect(rect: Rect): void {
    this.exactSnapRect(
      this.rectsForOverrides(this.getMoveTargetOverrides()),
      rect
    );
  }

  get snappings(): readonly (PointSnapping | SameMarginSnapping)[] {
    return this._snappings;
  }

  clear(): void {
    this._snappings = [];
  }

  readonly clearDebounced = debounce(
    action(() => this.clear()),
    1000
  );

  private rectsForOverrides(overrides: Set<ElementInstance>): Rect[] {
    const viewportRect = this.editorState.scroll.viewportRectInDocument;
    return [...overrides]
      .map((p) => p.boundingBox)
      .filter((rect) => !!viewportRect.intersection(rect));
  }
}
