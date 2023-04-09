import { getURLSafeBase64Hash } from "@uimix/foundation/src/utils/Hash";
import { ProjectJSON } from "@uimix/node-data";
import { isEqual, omit } from "lodash-es";

export function getPageID(pageName: string): string {
  return getURLSafeBase64Hash(pageName);
}

export function compareProjectJSONs(a: ProjectJSON, b: ProjectJSON): boolean {
  // skipping images as they may be very large
  return isEqual(omit(a, "images"), omit(b, "images"));
}
