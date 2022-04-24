import { reaction } from "mobx";
import { Document } from "../models/Document";
import { DefaultVariant, Variant } from "../models/Variant";
import { MountRegistry } from "./MountRegistry";
import { VariantMount } from "./VariantMount";

export class DocumentMount {
  constructor(getDocument: () => Document, domDocument: globalThis.Document) {
    this.getDocument = getDocument;
    this.domDocument = domDocument;

    const getAllVariants = () =>
      getDocument().components.children.flatMap((component) => [
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
    if (this.isDisposed) {
      throw new Error("DocumentMount is already disposed");
    }

    for (const variantMount of this.variantMounts) {
      variantMount.dispose();
    }
    this.disposers.forEach((disposer) => disposer());

    this.isDisposed = true;
  }

  private updateVariants(variants: (Variant | DefaultVariant)[]): void {
    const existingVariantMounts = new Map<
      Variant | DefaultVariant,
      VariantMount
    >();

    for (const variantMount of this.variantMounts) {
      existingVariantMounts.set(variantMount.variant, variantMount);
    }
    this.variantMounts = [];

    for (const variant of variants) {
      const variantMount =
        existingVariantMounts.get(variant) ||
        new VariantMount(variant, this.registry, this.domDocument);
      existingVariantMounts.delete(variant);
      this.variantMounts.push(variantMount);
    }
    console.log(this.variantMounts);

    for (const variantMount of existingVariantMounts.values()) {
      variantMount.dispose();
    }
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];

  readonly getDocument: () => Document;
  readonly domDocument: globalThis.Document;
  readonly registry = new MountRegistry();
  private variantMounts: VariantMount[] = [];
}
