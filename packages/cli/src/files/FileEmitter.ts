import * as HumanReadable from "./HumanReadableFormat";
import { Page } from "@uimix/model/src/models/Page";
import { Component } from "@uimix/model/src/models/Component";
import { compact } from "lodash-es";
import { VariantCondition } from "@uimix/model/src/data/v1";

export class PageFileEmitter {
  constructor(page: Page) {
    this.page = page;
  }

  page: Page;

  emit(): HumanReadable.PageNode {
    const components = this.page.components;
    // TODO: non-component nodes

    return {
      type: "page",
      children: components.map((c) => new ComponentEmitter(c).emit()),
    };
  }
}

export class ComponentEmitter {
  constructor(component: Component) {
    this.component = component;
  }

  component: Component;

  emit(): HumanReadable.ComponentNode {
    return {
      type: "component",
      props: {
        id: this.component.name,
      },
      children: [this.emitRootNode(), ...this.emitVariants()],
    };
  }

  emitRootNode(): HumanReadable.FrameNode {
    const root = this.component.rootNode.selectable;
    const variants = root.variantCorrespondings.filter(
      (corresponding) => corresponding.variant
    );
    // TODO: variants

    return {
      type: "frame",
      props: {
        id: "TODO",
        ...root.selfStyle.toJSON(),
      },
      children: [], // TODO
    };
  }

  emitVariants(): HumanReadable.VariantNode[] {
    return compact(
      this.component.variants.map((variant) => {
        if (!variant.condition) {
          return;
        }
        return {
          type: "variant",
          props: {
            condition: variant.condition,
          },
        };
      })
    );
  }
}

// e.g., "hover" or "maxWidth:767"
function variantConditionToText(condition: VariantCondition): string {
  throw new Error("Not implemented");
}
