import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { reaction } from "mobx";
import * as postcss from "postcss";
import { Component } from "../models/Component";
import { ElementInstance } from "../models/ElementInstance";
import { DefaultVariant, Variant } from "../models/Variant";
import { MountContext } from "./MountContext";
import { VariantMount } from "./VariantMount";

export class ComponentMount {
  constructor(component: Component, context: MountContext) {
    this.component = component;
    this.context = context;
    this.dom = context.domDocument.createElement("div");
    this.styleSheet = new context.domDocument.defaultView!.CSSStyleSheet();

    const getAllVariants = () => [
      component.defaultVariant,
      ...component.variants.children,
    ];

    this.disposers = [
      reaction(this.getCSSTexts.bind(this), this.updateCSS.bind(this), {
        fireImmediately: true,
      }),
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
          this.styleSheet,
          this.context
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

  readonly component: Component;
  readonly context: MountContext;
  readonly dom: HTMLDivElement;
  private variantMounts: VariantMount[] = [];
  private readonly styleSheet: CSSStyleSheet;

  private getCSSTexts(): postcss.Root {
    const root = new postcss.Root();

    for (const variant of this.component.allVariants) {
      const rootInstance = variant.rootInstance!;

      const instances = filterInstance(rootInstance.allDescendants, [
        ElementInstance,
      ]);

      const scope =
        variant.type === "defaultVariant" ? "" : ".variant-" + variant.key;

      for (const instance of instances) {
        if (instance !== rootInstance && !instance.element.id) {
          continue;
        }

        let selector: string;
        if (instance === rootInstance) {
          if (scope) {
            selector = `:host(${scope})`;
          } else {
            selector = `:host`;
          }
        } else {
          const id = instance.element.id;
          if (scope) {
            selector = `:host(${scope}) #${id}`;
          } else {
            selector = `#${id}`;
          }
        }

        const props = instance.style.toPostCSS({ selector });
        if (props.nodes.length) {
          root.append(props);
        }
      }
    }
    return root;
  }

  private updateCSS(css: postcss.Root): void {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.styleSheet.replaceSync(css);

    for (const mount of this.variantMounts) {
      mount.updateBoundingBoxLater();
    }
  }
}
