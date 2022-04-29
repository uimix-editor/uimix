import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { reaction } from "mobx";
import { DefaultVariant, Variant } from "../models/Variant";
import { EditorState } from "../state/EditorState";
import { BoundingBoxUpdateScheduler } from "./BoundingBoxUpdateScheduler";
import { MountRegistry } from "./MountRegistry";
import { VariantMount } from "./VariantMount";

export class DocumentMount {
  constructor(editorState: EditorState, domDocument: globalThis.Document) {
    this.editorState = editorState;
    this.dom = domDocument.createElement("div");

    const getAllVariants = () =>
      editorState.document.components.children.flatMap((component) => [
        component.defaultVariant,
        ...component.variants.children,
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
        new VariantMount(
          assertNonNull(variant.component),
          variant,
          {
            editorState: this.editorState,
            registry: this.registry,
            boundingBoxUpdateScheduler: this.boundingBoxUpdateScheduler,
          },
          this.dom.ownerDocument
        );
      existingVariantMounts.delete(variant);
      this.variantMounts.push(variantMount);
    }

    for (const variantMount of existingVariantMounts.values()) {
      variantMount.dispose();
    }

    while (this.dom.firstChild) {
      this.dom.firstChild.remove();
    }
    for (const variantMount of this.variantMounts) {
      this.dom.append(variantMount.dom);
    }
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];

  readonly editorState: EditorState;
  readonly dom: HTMLDivElement;
  readonly registry = new MountRegistry();
  readonly boundingBoxUpdateScheduler = new BoundingBoxUpdateScheduler();
  private variantMounts: VariantMount[] = [];
}
