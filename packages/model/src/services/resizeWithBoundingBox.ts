import { Selectable } from "../models/Selectable";
import { Rect } from "paintvec";

function setPositionConstraintValue(
  selectable: Selectable,
  axis: "x" | "y",
  rect: Rect,
  parentRect: Rect
) {
  const { style } = selectable;

  const position = style.position ?? {
    x: { type: "start", start: 0 },
    y: { type: "start", start: 0 },
  };

  const constraint = position[axis];
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
    ...position,
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
    let position = selectable.style.position ?? {
      x: { type: "start", start: 0 },
      y: { type: "start", start: 0 },
    };

    if (targets.x) {
      position = {
        ...position,
        x: {
          type: "start",
          start: bbox.left,
        },
      };
    }
    if (targets.y) {
      position = {
        ...position,
        y: {
          type: "start",
          start: bbox.top,
        },
      };
    }
    selectable.style.position = position;
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
