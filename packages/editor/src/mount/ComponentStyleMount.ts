import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { reaction } from "mobx";
import * as postcss from "postcss";
import replaceCSSURL from "replace-css-url";
import { TypedEmitter } from "tiny-typed-emitter";
import { Component } from "../models/Component";
import { ElementInstance } from "../models/ElementInstance";
import { MountContext } from "./MountContext";

export class ComponentStyleMount extends TypedEmitter<{
  change(): void;
}> {
  constructor(component: Component, context: MountContext) {
    super();
    this.component = component;
    this.context = context;
    this.styleSheet = new context.domDocument.defaultView!.CSSStyleSheet();

    this.disposers = [
      reaction(this.getCSSTexts.bind(this), this.updateCSS.bind(this), {
        fireImmediately: true,
      }),
    ];
  }

  dispose(): void {
    if (this.isDisposed) {
      throw new Error("ComponentStyleMount is already disposed");
    }
    this.disposers.forEach((disposer) => disposer());
    this.isDisposed = true;
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];

  readonly component: Component;
  readonly context: MountContext;
  readonly styleSheet: CSSStyleSheet;

  private getCSSTexts(): postcss.Root {
    const root = new postcss.Root();

    for (const variant of this.component.allVariants) {
      const rootInstance = variant.rootInstance!;

      const instances = filterInstance(rootInstance.allDescendants, [
        ElementInstance,
      ]);

      const scopes =
        variant.type === "defaultVariant"
          ? []
          : [variant.selector, ".variant-" + variant.key];
      for (const instance of instances) {
        if (instance !== rootInstance && !instance.element.id) {
          continue;
        }

        let selector: string;
        if (instance === rootInstance) {
          if (scopes.length) {
            selector = scopes.map((s) => `:host(${s})`).join(",");
          } else {
            selector = `:host`;
          }
        } else {
          const id = instance.element.id;
          if (scopes.length) {
            selector = scopes.map((s) => `:host(${s}) #${id}`).join(",");
          } else {
            selector = `#${id}`;
          }
        }

        const rule = new postcss.Rule({
          selector,
          nodes: instance.style.toPostCSS().nodes,
        });

        for (const node of rule.nodes) {
          if (node.type === "decl" && node.prop === "background") {
            node.value = replaceCSSURL(node.value, (url: string) =>
              this.context.editorState.resolveImageAssetURL(url)
            );
          }
        }

        if (rule.nodes.length) {
          root.append(rule);
        }
      }
    }
    return root;
  }

  private updateCSS(css: postcss.Root): void {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.styleSheet.replaceSync(css);

    this.emit("change");
  }
}
