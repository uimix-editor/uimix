import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { sum } from "lodash-es";
import { Rect } from "paintvec";
import { ElementInstance } from "../models/ElementInstance";

export type StackAlign = "start" | "center" | "end";

export class AutoLayout {
  static detectLayout(layers: readonly ElementInstance[]): {
    layers: readonly ElementInstance[];
    bbox: Rect;
    direction: "x" | "y";
    gap: number;
    align: StackAlign;
  } {
    if (!layers.length) {
      return {
        layers: layers,
        bbox: new Rect(),
        direction: "x",
        gap: 0,
        align: "start",
      };
    }
    if (layers.length === 1) {
      return {
        layers: layers,
        bbox: layers[0].offsetBoundingBox,
        direction: "x",
        gap: 0,
        align: "start",
      };
    }

    const topSorted = layers.slice();
    topSorted.sort((a, b) => a.boundingBox.top - b.boundingBox.top);
    const leftSorted = layers.slice();
    leftSorted.sort((a, b) => a.boundingBox.left - b.boundingBox.left);
    const bbox = assertNonNull(Rect.union(...layers.map((o) => o.boundingBox)));

    const xGaps: number[] = [];
    const yGaps: number[] = [];

    for (let i = 1; i < layers.length; ++i) {
      xGaps.push(
        leftSorted[i].boundingBox.left - leftSorted[i - 1].boundingBox.right
      );
      yGaps.push(
        topSorted[i].boundingBox.top - topSorted[i - 1].boundingBox.bottom
      );
    }

    const direction = sum(yGaps) < sum(xGaps) ? "x" : "y";

    if (direction === "x") {
      const startError = sum(layers.map((o) => o.boundingBox.top - bbox.top));
      const centerError = sum(
        layers.map((o) => Math.abs(o.boundingBox.center.y - bbox.center.y))
      );
      const endError = sum(
        layers.map((o) => bbox.bottom - o.boundingBox.bottom)
      );
      const align =
        startError < centerError && startError < endError
          ? "start"
          : centerError < endError
          ? "center"
          : "end";

      return {
        layers: leftSorted,
        bbox,
        direction: "x",
        gap: Math.max(Math.round(sum(xGaps) / xGaps.length), 0),
        align,
      };
    } else {
      const startError = sum(layers.map((o) => o.boundingBox.left - bbox.left));
      const centerError = sum(
        layers.map((o) => Math.abs(o.boundingBox.center.x - bbox.center.x))
      );
      const endError = sum(layers.map((o) => bbox.right - o.boundingBox.right));
      const align =
        startError < centerError && startError < endError
          ? "start"
          : centerError < endError
          ? "center"
          : "end";

      return {
        layers: topSorted,
        bbox,
        direction: "y",
        gap: Math.max(Math.round(sum(yGaps) / yGaps.length), 0),
        align,
      };
    }
  }
}
