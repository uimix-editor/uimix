function componentToHex(c: number): string {
  const hex = Math.round(c * 255).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbaToHex(rgba: RGBA | RGB): string {
  let ret =
    "#" +
    componentToHex(rgba.r) +
    componentToHex(rgba.g) +
    componentToHex(rgba.b);
  if ("a" in rgba && rgba.a !== 1) {
    ret += componentToHex(rgba.a);
  }
  return ret;
}

export function transformAngle(transform: Transform): number {
  return Math.atan2(transform[1][0], transform[0][0]);
}

export function compact<T>(arr: (T | undefined)[]): T[] {
  return arr.filter((x): x is T => !!x);
}
