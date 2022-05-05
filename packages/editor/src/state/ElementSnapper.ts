import { observable, makeObservable, action } from "mobx";
import { Rect, Vec2 } from "paintvec";
import { compact, debounce } from "lodash-es";
import {
  PointSnapping,
  SameMarginSnapping,
  snapPointToRects,
  snapRectToRects,
} from "@seanchas116/paintkit/src/util/Snapping";
import { ElementInstance } from "../models/ElementInstance";
import { EditorState } from "./EditorState";

export class ElementSnapper {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  private get threshold(): number {
    return this.editorState.snapThreshold;
  }

  private getTargetInstances(options: {
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

  private getResizeTargetInstances(): Set<ElementInstance> {
    return this.getTargetInstances({
      parents: true,
      siblings: true,
      children: true,
    });
  }

  private getMoveTargetInstances(): Set<ElementInstance> {
    return this.getTargetInstances({
      parents: true,
      siblings: true,
    });
  }

  private getInsertTargetInstances(): Set<ElementInstance> {
    return this.getTargetInstances({
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
      this.rectsForInstances(this.getInsertTargetInstances()),
      point
    );
  }

  snapResizePoint(
    point: Vec2,
    axes: { x?: boolean; y?: boolean } = { x: true, y: true }
  ): Vec2 {
    return this.snapPoint(
      this.rectsForInstances(this.getResizeTargetInstances()),
      point,
      axes
    );
  }

  snapMoveRect(rect: Rect): Rect {
    return this.snapRect(
      this.rectsForInstances(this.getMoveTargetInstances()),
      rect
    );
  }

  exactSnapMoveRect(rect: Rect): void {
    this.exactSnapRect(
      this.rectsForInstances(this.getMoveTargetInstances()),
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

  private rectsForInstances(instances: Set<ElementInstance>): Rect[] {
    const viewportRect = this.editorState.scroll.viewportRectInDocument;
    return [...instances]
      .map((p) => p.boundingBox)
      .filter((rect) => !!viewportRect.intersection(rect));
  }
}
