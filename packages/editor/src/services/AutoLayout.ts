import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { sum } from "lodash-es";
import { Rect } from "paintvec";
import { Element } from "../models/Element";
import { ElementInstance } from "../models/ElementInstance";

export type FlexAlign = "flex-start" | "center" | "flex-end";

export class AutoLayout {
  static groupElementsIntoFlex(
    layers: readonly ElementInstance[]
  ): ElementInstance | undefined {
    if (layers.length === 0) {
      return;
    }

    const layout = this.detectFlex(layers);
    const parent = layers[0].parent;
    const offsetParent = layers[0].offsetParent;
    if (!parent || !offsetParent) {
      return;
    }

    const stackElement = new Element({ tagName: "div" });
    stackElement.rename("flex-container");
    const stack = ElementInstance.get(layers[0].variant, stackElement);

    stack.style.position = "absolute";
    stack.style.left = `${layout.bbox.left - offsetParent.boundingBox.left}px`;
    stack.style.top = `${layout.bbox.top - offsetParent.boundingBox.top}px`;
    stack.style.display = "flex";
    stack.style.flexDirection = layout.direction;
    stack.style.rowGap = `${layout.gap}px`;
    stack.style.columnGap = `${layout.gap}px`;
    stack.style.alignItems = layout.align;

    parent.element.append(stackElement);

    stackElement.append(...layout.elements.map((i) => i.element));
    for (const i of layout.elements) {
      i.style.position = undefined;
      i.style.left = undefined;
      i.style.top = undefined;
      i.style.right = undefined;
      i.style.bottom = undefined;
    }

    return stack;
  }

  static detectFlex(elements: readonly ElementInstance[]): {
    elements: readonly ElementInstance[];
    bbox: Rect;
    direction: "column" | "row";
    gap: number;
    align: FlexAlign;
  } {
    if (!elements.length) {
      return {
        elements,
        bbox: new Rect(),
        direction: "row",
        gap: 0,
        align: "flex-start",
      };
    }
    if (elements.length === 1) {
      return {
        elements,
        bbox: elements[0].offsetBoundingBox,
        direction: "row",
        gap: 0,
        align: "flex-start",
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
          ? "flex-start"
          : centerError < endError
          ? "center"
          : "flex-end";

      return {
        elements: leftSorted,
        bbox,
        direction: "row",
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
          ? "flex-start"
          : centerError < endError
          ? "center"
          : "flex-end";

      return {
        elements: topSorted,
        bbox,
        direction: "column",
        gap: Math.max(Math.round(sum(yGaps) / yGaps.length), 0),
        align,
      };
    }
  }
}
