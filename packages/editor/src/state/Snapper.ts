import { observable, makeObservable, action } from "mobx";
import { Rect, Vec2 } from "paintvec";
import { debounce } from "lodash-es";
import {
  PointSnapping,
  SameMarginSnapping,
  snapPointToRects,
  snapRectToRects,
} from "../utils/Snapping";
import { Selectable } from "../models/Selectable";
import { scrollState } from "./ScrollState";
import { projectState } from "./ProjectState";

export class Snapper {
  constructor() {
    makeObservable(this);
  }

  private get threshold(): number {
    return scrollState.snapThreshold;
  }

  private getTargetInstances(options: {
    selection?: boolean;
    parents?: boolean;
    siblings?: boolean;
    children?: boolean;
  }): Set<Selectable> {
    const topLevels = new Set(
      projectState.page?.selectable.offsetChildren ?? []
    );

    const selection = new Set(projectState.selectedSelectables);
    if (!selection.size) {
      return topLevels;
    }

    const children = new Set<Selectable>();

    for (const s of selection) {
      for (const child of s.offsetChildren) {
        children.add(child);
      }
    }

    const parents = new Set<Selectable>();
    for (const s of selection) {
      const { offsetParent } = s;
      if (offsetParent) {
        parents.add(offsetParent);
      }
    }

    const siblings = new Set<Selectable>();

    for (const parent of parents) {
      for (const child of parent.offsetChildren) {
        if (!child.ancestorSelected) {
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

    const result = new Set<Selectable>();
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

  private getResizeTargetInstances(): Set<Selectable> {
    return this.getTargetInstances({
      parents: true,
      siblings: true,
      children: true,
    });
  }

  private getMoveTargetInstances(): Set<Selectable> {
    return this.getTargetInstances({
      parents: true,
      siblings: true,
    });
  }

  private getInsertTargetInstances(): Set<Selectable> {
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

  snapInsertPoint(parent: Selectable, point: Vec2): Vec2 {
    const rects = parent.offsetChildren.map((c) => c.computedRect);
    return this.snapPoint(rects, point);
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

  private rectsForInstances(instances: Set<Selectable>): Rect[] {
    const viewportRect = scrollState.viewportRectInDocument;
    return [...instances]
      .map((p) => p.computedRect)
      .filter((rect) => !!viewportRect.intersection(rect));
  }
}

export const snapper = new Snapper();
