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

export class Snapper {
  constructor() {
    makeObservable(this);
  }

  private get threshold(): number {
    return scrollState.snapThreshold;
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

  private resizeTargetRects(selectables: Selectable[]): Rect[] {
    const parents = new Set<Selectable>();
    for (const selectable of selectables) {
      const { offsetParent } = selectable;
      if (offsetParent) {
        parents.add(offsetParent);
      }
    }
    const siblings = new Set<Selectable>();
    for (const parent of parents) {
      for (const child of parent.offsetChildren) {
        siblings.add(child);
      }
    }
    for (const selectable of selectables) {
      siblings.delete(selectable);
    }

    return [
      ...[...siblings].map((c) => c.computedRect),
      ...[...parents].map((c) => c.computedPaddingRect),
    ];
  }

  snapResizePoint(
    selectables: Selectable[],
    point: Vec2,
    axes: { x?: boolean; y?: boolean } = { x: true, y: true }
  ): Vec2 {
    return this.snapPoint(this.resizeTargetRects(selectables), point, axes);
  }

  snapMoveRect(selectables: Selectable[], rect: Rect): Rect {
    return this.snapRect(this.resizeTargetRects(selectables), rect);
  }

  exactSnapMoveRect(selectables: Selectable[], rect: Rect): void {
    this.exactSnapRect(this.resizeTargetRects(selectables), rect);
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
