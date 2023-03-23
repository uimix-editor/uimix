import { Selectable } from "../models/Selectable";
import { Rect, Vec2 } from "paintvec";

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
  const offsetTopLeft =
    selectable.parent?.computedPaddingRect.topLeft ?? new Vec2(0);
  if (targets.x) {
    selectable.style.position = {
      ...selectable.style.position,
      x: {
        type: "start",
        start: [bbox.left - offsetTopLeft.x, "px"],
      },
    };
  }
  if (targets.y) {
    selectable.style.position = {
      ...selectable.style.position,
      y: {
        type: "start",
        start: [bbox.top - offsetTopLeft.y, "px"],
      },
    };
  }
  if (targets.width) {
    selectable.style.width = {
      type: "fixed",
      value: [bbox.width, "px"],
    };
  }
  if (targets.height) {
    selectable.style.height = {
      type: "fixed",
      value: [bbox.height, "px"],
    };
  }
}
