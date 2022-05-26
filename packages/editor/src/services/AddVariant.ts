import { Component } from "../models/Component";
import { Variant } from "../models/Variant";

export function addVariant(component: Component): Variant {
  const variant = new Variant();
  variant.selector = ":hover";
  component.variants.append(variant);

  return variant;
}
