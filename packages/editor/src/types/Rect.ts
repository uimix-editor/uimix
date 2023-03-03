import { Rect } from "paintvec";

export function roundRectXYWH(rect: Rect): Rect {
  return Rect.from({
    x: Math.round(rect.left),
    y: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  });
}
