import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { sum } from "lodash-es";
import { Rect } from "paintvec";
import { ElementInstance } from "../models/ElementInstance";

export type StackAlign = "start" | "center" | "end";

export class AutoLayout {
  static detectLayout(elements: readonly ElementInstance[]): {
    elements: readonly ElementInstance[];
    bbox: Rect;
    direction: "x" | "y";
    gap: number;
    align: StackAlign;
  } {
    if (!elements.length) {
      return {
        elements,
        bbox: new Rect(),
        direction: "x",
        gap: 0,
        align: "start",
      };
    }
    if (elements.length === 1) {
      return {
        elements,
        bbox: elements[0].offsetBoundingBox,
        direction: "x",
        gap: 0,
        align: "start",
      };
    }

    const topSorted = elements.slice();
    topSorted.sort((a, b) => a.boundingBox.top - b.boundingBox.top);
    const leftSorted = elements.slice();
    leftSorted.sort((a, b) => a.boundingBox.left - b.boundingBox.left);
    const bbox = assertNonNull(
      Rect.union(...elements.map((o) => o.boundingBox))
    );

    const xGaps: number[] = [];
    const yGaps: number[] = [];

    for (let i = 1; i < elements.length; ++i) {
      xGaps.push(
        leftSorted[i].boundingBox.left - leftSorted[i - 1].boundingBox.right
      );
      yGaps.push(
        topSorted[i].boundingBox.top - topSorted[i - 1].boundingBox.bottom
      );
    }

    const direction = sum(yGaps) < sum(xGaps) ? "x" : "y";

    if (direction === "x") {
      const startError = sum(elements.map((o) => o.boundingBox.top - bbox.top));
      const centerError = sum(
        elements.map((o) => Math.abs(o.boundingBox.center.y - bbox.center.y))
      );
      const endError = sum(
        elements.map((o) => bbox.bottom - o.boundingBox.bottom)
      );
      const align =
        startError < centerError && startError < endError
          ? "start"
          : centerError < endError
          ? "center"
          : "end";

      return {
        elements: leftSorted,
        bbox,
        direction: "x",
        gap: Math.max(Math.round(sum(xGaps) / xGaps.length), 0),
        align,
      };
    } else {
      const startError = sum(
        elements.map((o) => o.boundingBox.left - bbox.left)
      );
      const centerError = sum(
        elements.map((o) => Math.abs(o.boundingBox.center.x - bbox.center.x))
      );
      const endError = sum(
        elements.map((o) => bbox.right - o.boundingBox.right)
      );
      const align =
        startError < centerError && startError < endError
          ? "start"
          : centerError < endError
          ? "center"
          : "end";

      return {
        elements: topSorted,
        bbox,
        direction: "y",
        gap: Math.max(Math.round(sum(yGaps) / yGaps.length), 0),
        align,
      };
    }
  }
}
