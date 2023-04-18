import * as HumanReadable from "./HumanReadableFormat";
import { Page } from "@uimix/model/src/models/Page";
import { Component } from "@uimix/model/src/models/Component";
import { compact } from "lodash-es";
import { StyleJSON, VariantCondition } from "@uimix/model/src/data/v1";
import { Selectable } from "@uimix/model/src/models/Selectable";
import { generateLowerJSIdentifier } from "@uimix/foundation/src/utils/Name";

export class PageFileEmitter {
  constructor(page: Page) {
    this.page = page;
  }

  page: Page;

  emit(): HumanReadable.PageNode {
    const components = this.page.components;
    // TODO: non-component nodes

    const colorTokens = this.page.colorTokens;

    return {
      type: "page",
      children: [
        ...components.map((c) => new ComponentEmitter(c).emit()),
        ...colorTokens.all.map((token) => ({
          type: "colorToken" as const,
          props: {
            id: generateLowerJSIdentifier(token.name ?? ""),
            name: token.name,
            value: token.value?.toString() ?? "",
          },
        })),
      ],
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

  getStyleForSelectable(selectable: Selectable): HumanReadable.StyleProps {
    const getInstanceOverrides = (
      instanceSelectable: Selectable
    ): Record<string, HumanReadable.StyleProps> => {
      const mainComponent = instanceSelectable.mainComponent;
      if (!mainComponent) {
        return {};
      }
      const refIDs = mainComponent.refIDs;

      const overrides: Record<string, HumanReadable.StyleProps> = {};

      const visit = (selectable: Selectable) => {
        const refID = refIDs.get(selectable.node.id);

        if (refID) {
          overrides[refID] = toHumanReadableStyle(selectable.selfStyle);
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
      ...toHumanReadableStyle(selectable.selfStyle),
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

function toHumanReadableStyle(
  style: Partial<StyleJSON>
): Partial<HumanReadable.BaseStyleProps> {
  return {
    hidden: style.hidden,
    locked: style.locked,
    position: style.position && [style.position.x, style.position.y],
    absolute: style.absolute,
    width: style.width,
    height: style.height,

    topLeftRadius: style.topLeftRadius,
    topRightRadius: style.topRightRadius,
    bottomRightRadius: style.bottomRightRadius,
    bottomLeftRadius: style.bottomLeftRadius,

    fills: style.fills,
    border: style.border,
    borderTopWidth: style.borderTopWidth,
    borderRightWidth: style.borderRightWidth,
    borderBottomWidth: style.borderBottomWidth,
    borderLeftWidth: style.borderLeftWidth,

    opacity: style.opacity,
    overflowHidden: style.overflowHidden,

    shadows: style.shadows,

    marginTop: style.marginTop,
    marginRight: style.marginRight,
    marginBottom: style.marginBottom,
    marginLeft: style.marginLeft,

    layout: style.layout,
    flexDirection: style.flexDirection,
    flexAlign: style.flexAlign,
    flexJustify: style.flexJustify,
    gridRowCount: style.gridRowCount,
    gridColumnCount: style.gridColumnCount,
    rowGap: style.rowGap,
    columnGap: style.columnGap,
    paddingTop: style.paddingTop,
    paddingRight: style.paddingRight,
    paddingBottom: style.paddingBottom,
    paddingLeft: style.paddingLeft,

    textContent: style.textContent,
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    fontSize: style.fontSize,
    lineHeight:
      style.lineHeight && typeof style.lineHeight === "object"
        ? style.lineHeight.join("")
        : style.lineHeight,
    letterSpacing:
      style.letterSpacing && typeof style.letterSpacing === "object"
        ? style.letterSpacing.join("")
        : style.letterSpacing,
    textHorizontalAlign: style.textHorizontalAlign,
    textVerticalAlign: style.textVerticalAlign,

    image: style.imageHash, // TODO: use image path
    svg: style.svgContent,

    component: style.foreignComponent
      ? `${style.foreignComponent.path}#${style.foreignComponent.name}`
      : style.mainComponent,
    componentType: style.foreignComponent?.type,
    props: style.foreignComponent?.props,

    tagName: style.tagName,
  };
}
