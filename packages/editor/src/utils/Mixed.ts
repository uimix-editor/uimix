import { isEqual } from "lodash-es";

export const Mixed = Symbol("Mixed");

export type Mixed = typeof Mixed;

export function sameOrMixed<T>(values: readonly T[]): T | Mixed | undefined {
  if (values.length === 0) {
    return undefined;
  }

  const first = values[0];
  for (let i = 1; i < values.length; ++i) {
    if (!isEqual(first, values[i])) {
      return Mixed;
    }
  }
  return first;
}
