import sha256 from "js-sha256";
import { Buffer } from "buffer";

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

export async function imageHashToDataURL(imageHash: string) {
  const image = figma.getImageByHash(imageHash);
  if (!image) {
    return;
  }
  const data = await image.getBytesAsync();
  return imageToDataURL(data);
}

export function imageToDataURL(data: Uint8Array): string | undefined {
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e) {
    const base64 = Buffer.from(data).toString("base64");
    return "data:image/png;base64," + base64;
  } else if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    const base64 = Buffer.from(data).toString("base64");
    return "data:image/jpeg;base64," + base64;
  } else {
    console.error("TODO: unsupported image data type");
    return undefined;
  }
}

export function getURLSafeBase64Hash(data: Uint8Array): string {
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const hash = sha256.arrayBuffer(data) as ArrayBuffer;

  return Buffer.from(hash)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
