import { sum } from "lodash-es";
import { StackAlign } from "@uimix/node-data";
import { Rect } from "paintvec";
import { Selectable, StubComputedRectProvider } from "../models/Selectable";
import { assertNonNull } from "@uimix/foundation/src/utils/Assert";

export function removeLayout(selectable: Selectable): void {
  if (selectable.node.type !== "frame") {
    return;
  }
  if (selectable.style.layout === "none") {
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
    child.style.marginTop = 0;
    child.style.marginRight = 0;
    child.style.marginBottom = 0;
    child.style.marginLeft = 0;
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
  selectable.style.rowGap = 0;
  selectable.style.columnGap = 0;
  selectable.style.paddingTop = 0;
  selectable.style.paddingRight = 0;
  selectable.style.paddingBottom = 0;
  selectable.style.paddingLeft = 0;
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

// TODO: auto layout to grid
export function autoLayout(selectable: Selectable): void {
  if (selectable.node.type !== "frame") {
    return;
  }
  if (selectable.style.layout === "flex") {
    return;
  }

  const paddingRect = selectable.computedPaddingRect;

  const flex = detectFlex(
    selectable.children.filter((child) => !child.style.absolute)
  );

  const offsetBBox = flex.bbox.translate(paddingRect.topLeft.neg);
  const width = paddingRect.width;
  const height = paddingRect.height;

  selectable.style.flexDirection = flex.direction;
  selectable.style.flexAlign = flex.align;
  selectable.style.paddingLeft = Math.max(0, offsetBBox.left);
  selectable.style.paddingTop = Math.max(0, offsetBBox.top);
  selectable.style.paddingRight = Math.max(0, width - offsetBBox.right);
  selectable.style.paddingBottom = Math.max(0, height - offsetBBox.bottom);
  for (const [i, margin] of flex.margins.entries()) {
    const prop = flex.direction === "x" ? "marginRight" : "marginBottom";
    flex.elements[i].style[prop] = margin;
  }

  selectable.originalNode.append(flex.elements.map((e) => e.originalNode));

  selectable.style.layout = "flex";
}

// TODO: group to grid
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

  frame.style.layout = "flex";
  frame.style.flexDirection = flex.direction;
  frame.style.flexAlign = flex.align;
  for (const [i, margin] of flex.margins.entries()) {
    const prop = flex.direction === "x" ? "marginRight" : "marginBottom";
    flex.elements[i].style[prop] = margin;
  }

  frame.computedRectProvider = new StubComputedRectProvider(flex.bbox);

  frame.insertBefore(flex.elements, undefined);
  parent.insertBefore([frame], next);

  return frame;
}

interface Flex {
  elements: readonly Selectable[];
  bbox: Rect;
  direction: "x" | "y";
  margins: number[];
  align: StackAlign;
}

export function detectFlex(elements: readonly Selectable[]): Flex {
  if (!elements.length) {
    return {
      elements,
      bbox: new Rect(),
      direction: "x",
      margins: [],
      align: "start",
    };
  }
  if (elements.length === 1) {
    return {
      elements,
      bbox: elements[0].computedRect,
      direction: "x",
      margins: [],
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

  const xMargins: number[] = [];
  const yMargins: number[] = [];

  for (let i = 1; i < elements.length; ++i) {
    xMargins.push(
      leftSorted[i].computedRect.left - leftSorted[i - 1].computedRect.right
    );
    yMargins.push(
      topSorted[i].computedRect.top - topSorted[i - 1].computedRect.bottom
    );
  }

  const direction = sum(yMargins) < sum(xMargins) ? "x" : "y";

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
      margins: xMargins,
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
      margins: yMargins,
      align,
    };
  }
}

export function marginsToGap(frameSelectable: Selectable) {
  if (frameSelectable.style.layout !== "flex") {
    return;
  }

  const children = frameSelectable.children.filter(
    (child) => !child.isAbsolute
  );
  if (children.length < 2) {
    return;
  }

  const direction = frameSelectable.style.flexDirection;

  const margins: number[] = [];
  for (let i = 1; i < children.length; ++i) {
    margins.push(
      children[i].style[direction === "x" ? "marginLeft" : "marginTop"] +
        children[i - 1].style[
          direction === "x" ? "marginRight" : "marginBottom"
        ]
    );
  }
  const gap = Math.round(sum(margins) / margins.length);

  frameSelectable.style.rowGap = gap;
  frameSelectable.style.columnGap = gap;
  if (direction === "x") {
    frameSelectable.style.paddingLeft += children[0].style.marginLeft;
    frameSelectable.style.paddingRight +=
      children[children.length - 1].style.marginRight;
  } else {
    frameSelectable.style.paddingTop += children[0].style.marginTop;
    frameSelectable.style.paddingBottom +=
      children[children.length - 1].style.marginBottom;
  }

  for (const child of children) {
    if (direction === "x") {
      child.style.marginLeft = 0;
      child.style.marginRight = 0;
    } else {
      child.style.marginTop = 0;
      child.style.marginBottom = 0;
    }
  }
}

export function gapToMargins(frameSelectable: Selectable) {
  if (frameSelectable.style.layout !== "flex") {
    return;
  }

  const children = frameSelectable.children.filter(
    (child) => !child.isAbsolute
  );
  if (children.length < 2) {
    return;
  }

  const gapKey =
    frameSelectable.style.flexDirection === "x" ? "columnGap" : "rowGap";
  const gap = frameSelectable.style[gapKey];
  for (let i = 1; i < children.length; ++i) {
    const direction = frameSelectable.style.flexDirection;
    children[i - 1].style[direction === "x" ? "marginRight" : "marginBottom"] +=
      gap;
  }
  frameSelectable.style.rowGap = 0;
  frameSelectable.style.columnGap = 0;
}
