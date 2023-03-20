import { incrementAlphanumeric } from "@macaron-app/file-format";

function componentToHex(c: number): string {
  var hex = Math.round(c * 255).toString(16);
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

export function generateIDFromText(name: string): string {
  let id = name.replace(/[^a-zA-Z0-9]/g, "");
  if (/^[0-9]/.exec(id)) {
    id = `_${id}`;
  }
  return id;
}

export class IDGenerator {
  private ids = new Set<string>();

  generate(text: string): string {
    let id = generateIDFromText(text);
    while (this.ids.has(id)) {
      id = incrementAlphanumeric(id);
    }
    this.ids.add(id);
    return id;
  }
}
