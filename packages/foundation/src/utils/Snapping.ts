import { compact, uniq } from "lodash-es";
import { Rect, Vec2 } from "paintvec";
import { MultiMap } from "./MultiMap";

function overlaps(axis: "x" | "y", ...rects: Rect[]): boolean {
  const max = Math.min(...rects.map((r) => r.bottomRight[axis]));
  const min = Math.max(...rects.map((r) => r.topLeft[axis]));
  return min < max;
}

export interface Snapping<Axis extends "x" | "y" = "x" | "y"> {
  axis: Axis;
  offset: number;
}

function bestSnappings<T extends Snapping>(snappings: T[]): T[] {
  if (snappings.length === 0) {
    return [];
  }
  const minAbsOffset = Math.min(...snappings.map((s) => Math.abs(s.offset)));
  const snappingsWithMinAbsOffset = snappings.filter(
    (s) => Math.abs(s.offset) === minAbsOffset
  );
  const sign = snappingsWithMinAbsOffset.some((s) => s.offset < 0) ? -1 : 1;
  const offset = sign * minAbsOffset;
  return snappingsWithMinAbsOffset.filter((s) => s.offset === offset);
}

export interface PointSnapping<Axis extends "x" | "y" = "x" | "y">
  extends Snapping<Axis> {
  type: "point";
  target: Vec2;
  point: Vec2;
}

function pointSnappings<Axis extends "x" | "y">(
  axis: Axis,
  targets: Vec2[],
  point: Vec2,
  threshold: number
): PointSnapping<Axis>[] {
  const snappings: PointSnapping<Axis>[] = [];
  for (const target of targets) {
    const offset = target[axis] - point[axis];
    if (Math.abs(offset) > threshold) {
      continue;
    }

    snappings.push({
      type: "point",
      axis,
      target,
      point,
      offset,
    });
  }
  return bestSnappings(snappings);
}

export interface SameMarginSnapping<Axis extends "x" | "y" = "x" | "y">
  extends Snapping<Axis> {
  type: "sameMargin";
  margin: number;
  pairs: [Rect, Rect][];
}

function exactSameMarginSnappings<Axis extends "x" | "y">(
  axis: Axis,
  targetRects: Rect[],
  rect: Rect
): SameMarginSnapping<Axis> | undefined {
  const allRects = [
    ...targetRects.filter((r) => overlaps(axis === "x" ? "y" : "x", r, rect)),
    rect,
  ];

  const edges: { value: number; side: "min" | "max"; rect: Rect }[] = [];
  for (const rect of allRects) {
    edges.push({ value: rect.topLeft[axis], side: "min", rect });
    edges.push({ value: rect.bottomRight[axis], side: "max", rect });
  }
  edges.sort((a, b) => a.value - b.value);

  const margins = new MultiMap<number, [Rect, Rect]>();

  for (let i = 1; i < edges.length; ++i) {
    const a = edges[i - 1];
    const b = edges[i];
    const margin = b.value - a.value;
    if (margin > 0 && a.side === "max" && b.side === "min") {
      margins.set(margin, [a.rect, b.rect]);
    }
  }

  for (const [margin, pairSet] of margins) {
    const pairs = [...pairSet];
    const hasMultipleRanges =
      2 <= uniq(pairs.map((p) => p[0].bottomRight[axis])).length;
    if (hasMultipleRanges && pairs.some((pair) => pair.includes(rect))) {
      return {
        type: "sameMargin",
        axis,
        offset: 0,
        margin,
        pairs,
      };
    }
  }
}

function sameMarginSnappings<Axis extends "x" | "y">(
  axis: Axis,
  targetRects: Rect[],
  rect: Rect,
  maxOffset: number
): SameMarginSnapping<Axis> | undefined {
  rect = rect.toIntBounding();
  targetRects = targetRects.map((r) => r.toIntBounding());

  const snapping = exactSameMarginSnappings(axis, targetRects, rect);
  if (snapping) {
    return snapping;
  }

  for (let offset = 1; offset < maxOffset; ++offset) {
    for (const sign of [-1, 1]) {
      const offsetRect = rect.translate(Vec2.from({ [axis]: offset * sign }));
      const snapping = exactSameMarginSnappings(axis, targetRects, offsetRect);
      if (snapping) {
        return {
          ...snapping,
          offset: offset * sign,
        };
      }
    }
  }
}

function rectSnapPoints(rect: Rect) {
  const points: Vec2[] = [];
  const { topLeft, bottomRight } = rect;
  for (let y = 0; y <= 2; ++y) {
    for (let x = 0; x <= 2; ++x) {
      if (x === 1 && y === 1) {
        continue;
      }
      const ratio = new Vec2(x / 2, y / 2);
      const p = bottomRight
        .mul(ratio)
        .add(topLeft.mul(new Vec2(1).sub(ratio))).round;
      points.push(p);
    }
  }
  return points;
}

function pointToRectSnappings(
  axis: "x" | "y",
  targetRects: Rect[],
  point: Vec2,
  threshold: number
): PointSnapping[] {
  const targetPoints = targetRects.flatMap(rectSnapPoints);
  return pointSnappings(axis, targetPoints, point, threshold);
}

function rectToRectSnappings(
  axis: "x" | "y",
  targetRects: Rect[],
  rect: Rect,
  threshold: number
): (PointSnapping | SameMarginSnapping)[] {
  const targetPoints = targetRects.flatMap(rectSnapPoints);

  return bestSnappings([
    ...rectSnapPoints(rect).flatMap((p) =>
      pointSnappings(axis, targetPoints, p, threshold)
    ),
    ...compact([sameMarginSnappings(axis, targetRects, rect, threshold)]),
  ]);
}

function applySnappingToPoint(
  p: Vec2,
  snappings: {
    x: Snapping[];
    y: Snapping[];
  }
) {
  return p.add(
    new Vec2(snappings.x[0]?.offset ?? 0, snappings.y[0]?.offset ?? 0)
  );
}

function applySnappingToRect(
  rect: Rect,
  snappings: {
    x: Snapping[];
    y: Snapping[];
  }
) {
  return rect.translate(
    new Vec2(snappings.x[0]?.offset ?? 0, snappings.y[0]?.offset ?? 0)
  );
}

export function snapRectToRects(
  targetRects: Rect[],
  rect: Rect,
  threshold: number,
  axes: { x?: boolean; y?: boolean } = { x: true, y: true }
): [Rect, (PointSnapping | SameMarginSnapping)[]] {
  let xSnappings = axes.x
    ? rectToRectSnappings("x", targetRects, rect, threshold)
    : [];
  const ySnappings = axes.y
    ? rectToRectSnappings("y", targetRects, rect, threshold)
    : [];
  if (ySnappings.length) {
    // Do x snapping twice to update y positions of snapping infos to new ones
    xSnappings = axes.x
      ? rectToRectSnappings(
          "x",
          targetRects,
          applySnappingToRect(rect, { x: [], y: ySnappings }),
          threshold
        )
      : [];
  }
  return [
    applySnappingToRect(rect, { x: xSnappings, y: ySnappings }),
    [...xSnappings, ...ySnappings],
  ];
}

export function snapPointToRects(
  targetRects: Rect[],
  point: Vec2,
  threshold: number,
  axes: { x?: boolean; y?: boolean } = { x: true, y: true }
): [Vec2, (PointSnapping | SameMarginSnapping)[]] {
  let xSnappings = axes.x
    ? pointToRectSnappings("x", targetRects, point, threshold)
    : [];
  const ySnappings = axes.y
    ? pointToRectSnappings("y", targetRects, point, threshold)
    : [];
  if (ySnappings.length) {
    // Do x snapping twice to update y positions of snapping infos to new ones
    xSnappings = axes.x
      ? pointToRectSnappings(
          "x",
          targetRects,
          applySnappingToPoint(point, { x: [], y: ySnappings }),
          threshold
        )
      : [];
  }
  return [
    applySnappingToPoint(point, { x: xSnappings, y: ySnappings }),
    [...xSnappings, ...ySnappings],
  ];
}
