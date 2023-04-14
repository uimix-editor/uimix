import { ProjectJSON, StyleJSON } from "../v1";
import { isEqual, omit } from "lodash-es";
import sha256 from "crypto-js/sha256";
import encBase64url from "crypto-js/enc-base64url";

export function getPageID(pageName: string): string {
  return sha256(pageName).toString(encBase64url);
}

export function compareProjectJSONs(a: ProjectJSON, b: ProjectJSON): boolean {
  // skipping images as they may be very large
  return isEqual(omit(a, "images"), omit(b, "images"));
}

export function usedImageHashesInStyle(style: Partial<StyleJSON>): string[] {
  const hashes: string[] = [];

  if (style.imageHash) {
    hashes.push(style.imageHash);
  }

  // TODO: background images? (in the future)

  return hashes;
}
