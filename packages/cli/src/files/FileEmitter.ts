import * as HumanReadable from "./HumanReadableFormat";
import { Page } from "@uimix/model/src/models/Page";
import { Component } from "@uimix/model/src/models/Component";
import { compact } from "lodash-es";
import { VariantCondition } from "@uimix/model/src/data/v1";
import { Selectable } from "@uimix/model/src/models/Selectable";

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
    this.refIDs = component.refIDs;
  }

  component: Component;
  refIDs: Map<string, string>;

  emit(): HumanReadable.ComponentNode {
    return {
      type: "component",
      props: {
        id: this.component.name,
      },
      children: [
        this.emitNode(this.component.rootNode.selectable),
        ...this.emitVariants(),
      ],
    };
  }

  emitNode(selectable: Selectable): HumanReadable.FrameNode {
    const variants = selectable.variantCorrespondings.filter(
      (corresponding) => corresponding.variant
    );

    const refID = this.refIDs.get(selectable.node.id);

    const children =
      selectable.originalNode.type === "instance"
        ? [] // TODO: create override elements
        : selectable.children.map((child) => this.emitNode(child));

    return {
      type: selectable.originalNode.type,
      props: {
        id: refID ?? "TODO",
        ...selectable.selfStyle.toJSON(),
        variants: Object.fromEntries(
          variants.map((corresponding) => {
            return [
              variantConditionToText(corresponding.variant!.condition!),
              corresponding.selectable.selfStyle.toJSON(),
            ];
          })
        ),
      },
      children,
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
  if (condition.type === "maxWidth") {
    return `maxWidth:${condition.value}`;
  }
  return condition.type;
}
