import { reaction } from "mobx";
import { Document } from "../models/Document";
import { Variant } from "../models/Variant";
import { MountRegistry } from "./MountRegistry";
import { VariantMount } from "./VariantMount";

export class DocumentMount {
  constructor(document: Document) {
    this.document = document;

    const getAllVariants = () =>
      document.components.flatMap((component) => [
        component.defaultVariant,
        ...component.variants,
      ]);

    this.disposers = [
      reaction(getAllVariants, (variants) => {
        this.updateVariants(variants);
      }),
    ];
    this.updateVariants(getAllVariants());
  }

  dispose(): void {
    for (const variantMount of this.variantMounts) {
      variantMount.dispose();
    }
    this.disposers.forEach((disposer) => disposer());
  }

  private updateVariants(variants: Variant[]): void {
    const existingVariantMounts = new Map<Variant, VariantMount>();

    for (const variantMount of this.variantMounts) {
      existingVariantMounts.set(variantMount.variant, variantMount);
    }
    this.variantMounts = [];

    for (const variant of variants) {
      if (existingVariantMounts.has(variant)) {
        existingVariantMounts.delete(variant);
      } else {
        const variantMount = new VariantMount(variant, this.registry);
        this.variantMounts.push(variantMount);
      }
    }

    for (const variantMount of existingVariantMounts.values()) {
      variantMount.dispose();
    }
  }

  readonly document: Document;
  readonly registry = new MountRegistry();
  readonly disposers: (() => void)[] = [];
  variantMounts: VariantMount[] = [];
}
