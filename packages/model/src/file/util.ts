import { VariantCondition } from "../data/v1";

// e.g., "hover" or "maxWidth:767"
export function variantConditionToText(condition: VariantCondition): string {
  if (condition.type === "maxWidth") {
    return `maxWidth:${condition.value}`;
  }
  return condition.type;
}

export function filterUndefined<T extends object>(obj: T): T {
  const result = {} as T;
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key]!;
    }
  }
  return result;
}

export interface Variant {
  id: string;
  condition: VariantCondition;
}
