import { last } from "lodash-es";
import { Component } from "../models/Component";
import { Variant } from "../models/Variant";

export function addVariant(component: Component): Variant {
  const lastVariant = last(component.allVariants);
  const lastVariantRect = lastVariant?.rootInstance?.boundingBox;

  const variant = new Variant();
  variant.selector = ":hover";

  if (lastVariantRect) {
    variant.x = Math.round(lastVariantRect.left + lastVariantRect.width + 24);
    variant.y = Math.round(lastVariantRect.top);
  }

  component.variants.append(variant);

  return variant;
}
