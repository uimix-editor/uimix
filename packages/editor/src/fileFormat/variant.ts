import type * as hast from "hast";
import { h } from "hastscript";
import { DefaultVariant, Variant } from "../models/Variant";

export function dumpVariant(variant: Variant | DefaultVariant): hast.Element {
  return h("macaron-variant", {
    x: variant.x,
    y: variant.y,
    width: variant.width,
    height: variant.height,
    ...(variant.type === "variant"
      ? {
          selector: variant.selector || undefined,
          media: variant.mediaQuery || undefined,
        }
      : undefined),
  });
}

export function loadVariantDimensions(
  variant: Variant | DefaultVariant,
  node: hast.Element
): void {
  variant.x = Number(node.properties?.x ?? 0);
  variant.y = Number(node.properties?.y ?? 0);
  if (node.properties?.width) {
    variant.width = Number(node.properties.width);
  }
  if (node.properties?.height) {
    variant.height = Number(node.properties.height);
  }
}

export function loadVariant(node: hast.Element): Variant {
  const variant = new Variant();
  variant.selector = String(node.properties?.selector ?? "");
  variant.mediaQuery = String(node.properties?.media ?? "");
  loadVariantDimensions(variant, node);
  return variant;
}
