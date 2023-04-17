import * as HumanReadable from "./HumanReadableFormat";
import { Page } from "@uimix/model/src/models/Page";
import { Component } from "@uimix/model/src/models/Component";
import { compact, over } from "lodash-es";
import { StyleJSON, VariantCondition } from "@uimix/model/src/data/v1";
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
        ? []
        : selectable.children.map((child) => this.emitNode(child));

    return {
      type: selectable.originalNode.type,
      props: {
        id: refID ?? "TODO",
        ...this.getStyleForSelectable(selectable),
        variants: Object.fromEntries(
          variants.map((corresponding) => {
            return [
              variantConditionToText(corresponding.variant!.condition!),
              this.getStyleForSelectable(corresponding.selectable),
            ];
          })
        ),
      },
      children,
    };
  }

  getStyleForSelectable(selectable: Selectable) {
    const getInstanceOverrides = (
      instanceSelectable: Selectable
    ): Record<string, Partial<StyleJSON>> => {
      const mainComponent = instanceSelectable.mainComponent;
      if (!mainComponent) {
        return {};
      }
      const refIDs = mainComponent.refIDs;

      const overrides: Record<string, Partial<StyleJSON>> = {};

      const visit = (selectable: Selectable) => {
        const refID = refIDs.get(selectable.node.id);

        if (refID) {
          overrides[refID] = selectable.selfStyle.toJSON();
        }

        if (selectable.originalNode.type === "instance") {
          overrides[refID!]["overrides"] = getInstanceOverrides(selectable);
        } else {
          selectable.children.forEach((child) => visit(child));
        }
      };

      instanceSelectable.children.forEach(visit);

      return overrides;
    };

    return {
      ...selectable.selfStyle.toJSON(),
      ...(selectable.originalNode.type === "instance"
        ? {
            overrides: getInstanceOverrides(selectable),
          }
        : {}),
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
