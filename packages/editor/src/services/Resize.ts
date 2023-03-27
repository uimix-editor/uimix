import { Selectable } from "../models/Selectable";
import { Rect } from "paintvec";

function setPositionConstraintValue(
  selectable: Selectable,
  axis: "x" | "y",
  rect: Rect,
  parentRect: Rect
) {
  const { style } = selectable;

  const constraint = style.position[axis];
  const parentSize = parentRect[axis === "x" ? "width" : "height"];
  const start =
    rect[axis === "x" ? "left" : "top"] -
    parentRect[axis === "x" ? "left" : "top"];
  const size = rect[axis === "x" ? "width" : "height"];

  let newConstraint = constraint;

  switch (constraint.type) {
    case "start": {
      newConstraint = {
        type: "start",
        start,
      };
      break;
    }
    case "end": {
      newConstraint = {
        type: "end",
        end: parentSize - start - size,
      };
      break;
    }
    case "both": {
      newConstraint = {
        type: "both",
        start,
        end: constraint.end,
      };
      break;
    }
  }

  style.position = {
    ...style.position,
    [axis]: newConstraint,
  };
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
  console.log("resize", targets);
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
    if (targets.x) {
      selectable.style.position = {
        ...selectable.style.position,
        x: {
          type: "start",
          start: bbox.left,
        },
      };
    }
    if (targets.y) {
      selectable.style.position = {
        ...selectable.style.position,
        y: {
          type: "start",
          start: bbox.top,
        },
      };
    }
  }

  if (targets.width) {
    selectable.style.width = {
      type: "fixed",
      value: bbox.width,
    };
  }
  if (targets.height) {
    selectable.style.height = {
      type: "fixed",
      value: bbox.height,
    };
  }
}
