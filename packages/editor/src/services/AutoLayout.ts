import { sum } from "lodash-es";
import { StackAlign } from "@uimix/node-data";
import { Rect } from "paintvec";
import { Selectable, StubComputedRectProvider } from "../models/Selectable";
import { assertNonNull } from "../utils/Assert";

export function removeLayout(selectable: Selectable): void {
  if (selectable.node.type !== "frame") {
    return;
  }
  if (selectable.style.layout !== "stack") {
    return;
  }

  for (const child of selectable.children) {
    child.style.position = {
      x: {
        type: "start",
        start: child.computedOffsetRect.left,
      },
      y: {
        type: "start",
        start: child.computedOffsetRect.top,
      },
    };
  }

  if (selectable.style.width.type === "hug") {
    selectable.style.width = {
      type: "fixed",
      value: selectable.computedRect.width,
    };
  }
  if (selectable.style.height.type === "hug") {
    selectable.style.height = {
      type: "fixed",
      value: selectable.computedRect.height,
    };
  }

  selectable.style.layout = "none";
}

export function ungroup(selectable: Selectable): void {
  if (selectable.node.type !== "frame") {
    return;
  }

  const parent = selectable.parent;
  if (!parent) {
    return;
  }
  const next = selectable.nextSibling;
  const children = selectable.children;

  parent.insertBefore(children, next);
  selectable.remove();

  for (const child of children) {
    const pos = child.computedOffsetRect.topLeft;

    child.style.position = {
      x: {
        type: "start",
        start: pos.x,
      },
      y: {
        type: "start",
        start: pos.y,
      },
    };
  }
}

export function autoLayout(selectable: Selectable): void {
  if (selectable.node.type !== "frame") {
    return;
  }
  if (selectable.style.layout === "stack") {
    return;
  }

  const paddingRect = selectable.computedPaddingRect;

  const flex = detectFlex(selectable.children);

  const offsetBBox = flex.bbox.translate(paddingRect.topLeft.neg);
  const width = paddingRect.width;
  const height = paddingRect.height;

  selectable.style.stackDirection = flex.direction;
  selectable.style.stackAlign = flex.align;
  selectable.style.gap = flex.gap;
  selectable.style.paddingLeft = Math.max(0, offsetBBox.left);
  selectable.style.paddingTop = Math.max(0, offsetBBox.top);
  selectable.style.paddingRight = Math.max(0, width - offsetBBox.right);
  selectable.style.paddingBottom = Math.max(0, height - offsetBBox.bottom);

  selectable.originalNode.append(flex.elements.map((e) => e.originalNode));

  selectable.style.layout = "stack";
}

export function groupAndAutoLayout(
  selectables: readonly Selectable[]
): Selectable | undefined {
  if (!selectables.length) {
    return;
  }

  const parent = selectables[selectables.length - 1].parent;
  if (!parent) {
    return;
  }
  const next = selectables.at(-1)?.nextSibling;

  const flex = detectFlex(selectables);
  const offsetBBox = flex.bbox.translate(parent.computedRect.topLeft.neg);

  const frame = parent.project.nodes.create("frame").selectable;
  frame.node.name = "Frame";
  frame.style.position = {
    x: {
      type: "start",
      start: offsetBBox.left,
    },
    y: {
      type: "start",
      start: offsetBBox.top,
    },
  };
  frame.style.width = {
    type: "fixed",
    value: offsetBBox.width,
  };
  frame.style.height = {
    type: "fixed",
    value: offsetBBox.height,
  };

  frame.style.layout = "stack";
  frame.style.stackDirection = flex.direction;
  frame.style.stackAlign = flex.align;
  frame.style.gap = flex.gap;

  frame.computedRectProvider = new StubComputedRectProvider(flex.bbox);

  frame.insertBefore(flex.elements, undefined);
  parent.insertBefore([frame], next);

  return frame;
}

export function detectFlex(elements: readonly Selectable[]): {
  elements: readonly Selectable[];
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
      bbox: elements[0].computedRect,
      direction: "x",
      gap: 0,
      align: "start",
    };
  }

  const topSorted = elements.slice();
  topSorted.sort((a, b) => a.computedRect.top - b.computedRect.top);
  const leftSorted = elements.slice();
  leftSorted.sort((a, b) => a.computedRect.left - b.computedRect.left);
  const bbox = assertNonNull(
    Rect.union(...elements.map((o) => o.computedRect))
  );

  const xGaps: number[] = [];
  const yGaps: number[] = [];

  for (let i = 1; i < elements.length; ++i) {
    xGaps.push(
      leftSorted[i].computedRect.left - leftSorted[i - 1].computedRect.right
    );
    yGaps.push(
      topSorted[i].computedRect.top - topSorted[i - 1].computedRect.bottom
    );
  }

  const direction = sum(yGaps) < sum(xGaps) ? "x" : "y";

  if (direction === "x") {
    const startError = sum(elements.map((o) => o.computedRect.top - bbox.top));
    const centerError = sum(
      elements.map((o) => Math.abs(o.computedRect.center.y - bbox.center.y))
    );
    const endError = sum(
      elements.map((o) => bbox.bottom - o.computedRect.bottom)
    );
    const align =
      (startError === 0 && endError === 0) ||
      (startError < centerError && startError < endError)
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
      elements.map((o) => o.computedRect.left - bbox.left)
    );
    const centerError = sum(
      elements.map((o) => Math.abs(o.computedRect.center.x - bbox.center.x))
    );
    const endError = sum(
      elements.map((o) => bbox.right - o.computedRect.right)
    );
    const align =
      (startError === 0 && endError === 0) ||
      (startError < centerError && startError < endError)
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
