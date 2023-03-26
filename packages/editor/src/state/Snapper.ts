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
    return this.snapPoint(this.targetRects(parent, []), point);
  }

  private targetRects(parent: Selectable, excludes: Selectable[]): Rect[] {
    const siblings = new Set<Selectable>();
    for (const child of parent.offsetChildren) {
      siblings.add(child);
    }
    for (const selectable of excludes) {
      siblings.delete(selectable);
    }

    return [
      ...[...siblings].map((c) => c.computedRect),
      parent.computedPaddingRect,
    ];
  }

  snapResizePoint(
    selectables: Selectable[],
    point: Vec2,
    axes: { x?: boolean; y?: boolean } = { x: true, y: true }
  ): Vec2 {
    if (selectables.length === 0) {
      return point;
    }
    const parent = selectables[0].offsetParent ?? selectables[0].pageSelectable;
    if (!parent) {
      return point;
    }

    return this.snapPoint(this.targetRects(parent, selectables), point, axes);
  }

  snapMoveRect(
    parent: Selectable,
    selectables: Selectable[],
    rect: Rect
  ): Rect {
    return this.snapRect(this.targetRects(parent, selectables), rect);
  }

  exactSnapMoveRect(
    parent: Selectable,
    selectables: Selectable[],
    rect: Rect
  ): void {
    this.exactSnapRect(this.targetRects(parent, selectables), rect);
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
