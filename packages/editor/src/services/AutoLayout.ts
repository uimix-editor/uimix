import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { sum } from "lodash-es";
import { Rect } from "paintvec";
import { Element } from "../models/Element";
import { ElementInstance } from "../models/ElementInstance";
import { getInstance } from "../models/InstanceRegistry";

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
    const stack = getInstance(layers[0].variant, stackElement);

    if (!layers[0].isInFlow) {
      stack.style.position = "absolute";
      stack.style.left = `${
        layout.bbox.left - offsetParent.boundingBox.left
      }px`;
      stack.style.top = `${layout.bbox.top - offsetParent.boundingBox.top}px`;
    }
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

  static canAutoLayoutChildren(instance: ElementInstance): boolean {
    const { children } = instance;
    if (children.length === 0) {
      return false;
    }

    for (const child of children) {
      if (child.type === "text") {
        return false;
      }
      if (child.isInFlow) {
        return false;
      }
    }
    return true;
  }

  static autoLayoutChildren(instance: ElementInstance): void {
    const layout = this.detectFlex(
      instance.children.filter(
        (o): o is ElementInstance => o.type === "element"
      )
    );

    instance.style.display = "flex";
    instance.style.flexDirection = layout.direction;
    instance.style.rowGap = `${layout.gap}px`;
    instance.style.columnGap = `${layout.gap}px`;

    const bbox = layout.bbox.translate(instance.boundingBox.topLeft.neg);
    const size = instance.boundingBox.size;

    const paddingLeft = bbox.left;
    const paddingRight = Math.max(0, size.x - bbox.width - bbox.left);
    const paddingTop = bbox.top;
    const paddingBottom = Math.max(0, size.y - bbox.height - bbox.top);

    instance.style.paddingLeft = `${paddingLeft}px`;
    instance.style.paddingRight = `${paddingRight}px`;
    instance.style.paddingTop = `${paddingTop}px`;
    instance.style.paddingBottom = `${paddingBottom}px`;

    instance.style.width = undefined;
    instance.style.height = undefined;

    instance.element.replaceChildren(layout.elements.map((i) => i.element));
    for (const child of layout.elements) {
      child.style.position = undefined;
      child.style.left = undefined;
      child.style.top = undefined;
      child.style.right = undefined;
      child.style.bottom = undefined;
    }
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
        (startError === 0 && endError === 0) ||
        (startError < centerError && startError < endError)
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
        (startError === 0 && endError === 0) ||
        (startError < centerError && startError < endError)
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
