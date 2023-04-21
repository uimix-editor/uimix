import { VariantCondition } from "../data/v1";

// e.g., "hover" or "maxWidth:767"
export function variantConditionText(condition: VariantCondition): string {
  if (condition.type === "maxWidth") {
    return `maxWidth:${condition.value}`;
  }
  return condition.type;
}

export function filterUndefined<T extends object>(obj: T): T {
  const result = {} as T;
  for (const key in obj) {
    if (obj[key] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result[key] = obj[key]!;
    }
  }
  return result;
}
