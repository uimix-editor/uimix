import { Project, Style } from "../v1";
import { isEqual, omit } from "lodash-es";
import sha256 from "crypto-js/sha256";
import encBase64url from "crypto-js/enc-base64url";

export function getPageID(pageName: string): string {
  return sha256(pageName).toString(encBase64url);
}

export function compareProjectJSONs(a: Project, b: Project): boolean {
  // skipping images as they may be very large
  return isEqual(omit(a, "images"), omit(b, "images"));
}

export function usedImageHashesInStyle(style: Partial<Style>): Set<string> {
  const hashes = new Set<string>();

  if (style.imageHash) {
    hashes.add(style.imageHash);
  }

  // TODO: background images? (in the future)

  return hashes;
}

export function usedImageHashesInProject(project: Project): Set<string> {
  const hashes = new Set<string>();
  for (const style of Object.values(project.styles)) {
    for (const hash of usedImageHashesInStyle(style)) {
      hashes.add(hash);
    }
  }
  return hashes;
}
