import { Selectable } from "../models/Selectable";
import { Rect } from "paintvec";

function setPositionConstraintValue(
  selectable: Selectable,
  axis: "x" | "y",
  rect: Rect,
  parentRect: Rect
) {
  const { style } = selectable;

  const position = {
    ...(style.position ?? {
      left: 0,
      top: 0,
    }),
  };

  if (axis === "x") {
    const left = rect.left - parentRect.left;
    const right = parentRect.width - left - rect.width;
    if ("left" in position) {
      position.left = left;
    }
    if ("right" in position) {
      position.right = right;
    }
  } else {
    const top = rect.top - parentRect.top;
    const bottom = parentRect.height - top - rect.height;
    if ("top" in position) {
      position.top = top;
    }
    if ("bottom" in position) {
      position.bottom = bottom;
    }
  }

  style.position = position;
}

export function resizeWithBoundingBox(
  selectable: Selectable,
  bbox: Rect,
  targets: {
    x?: boolean;
    y?: boolean;
    width?: boolean;
    height?: boolean;
  }
) {
  if (targets.x || targets.y) {
    // clear margins when repositioning
    selectable.style.marginTop = 0;
    selectable.style.marginRight = 0;
    selectable.style.marginBottom = 0;
    selectable.style.marginLeft = 0;
  }

  const parent = selectable.offsetParent;
  if (parent) {
    const parentRect = parent.computedPaddingRect;
    if (targets.x) {
      setPositionConstraintValue(selectable, "x", bbox, parentRect);
    }
    if (targets.y) {
      setPositionConstraintValue(selectable, "y", bbox, parentRect);
    }
  } else {
    if (targets.x || targets.y) {
      selectable.style.position = {
        left: bbox.left,
        top: bbox.top,
      };
    }
  }

  if (targets.width) {
    selectable.style.width = bbox.width;
  }
  if (targets.height) {
    selectable.style.height = bbox.height;
  }
}
