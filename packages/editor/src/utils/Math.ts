import { Rect, Vec2 } from "paintvec";

// https://stackoverflow.com/a/175787
export function isNumeric(str: string): boolean {
  return (
    typeof str === "string" && !isNaN(str as never) && !isNaN(parseFloat(str))
  );
}

export function mod(x: number, y: number): number {
  return x - y * Math.floor(x / y);
}

export function isNearEqual(x: number, y: number, delta: number): boolean {
  return Math.abs(x - y) <= delta;
}

export function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function roundToFixed(x: number, precision = 5): number {
  return Number.parseFloat(x.toFixed(precision));
}

export function roundToFixedRect(rect: Rect, precision = 5): Rect {
  return Rect.from({
    left: roundToFixed(rect.left, precision),
    top: roundToFixed(rect.top, precision),
    width: roundToFixed(rect.width, precision),
    height: roundToFixed(rect.height, precision),
  });
}

export function roundToFixedVec(vec: Vec2, precision = 5): Vec2 {
  return new Vec2(
    roundToFixed(vec.x, precision),
    roundToFixed(vec.y, precision)
  );
}
