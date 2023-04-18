import * as HumanReadable from "./HumanReadableFormat";
import { Page } from "@uimix/model/src/models/Page";
import { Component } from "@uimix/model/src/models/Component";
import { compact } from "lodash-es";
import {
  Color,
  SolidFill,
  StyleJSON,
  VariantCondition,
} from "@uimix/model/src/data/v1";
import { Selectable } from "@uimix/model/src/models/Selectable";
import { generateLowerJSIdentifier } from "@uimix/foundation/src/utils/Name";
import { posix as path } from "path-browserify";

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

    const variantStyles = Object.fromEntries(
      variants.map((corresponding) => {
        return [
          variantConditionToText(corresponding.variant!.condition!),
          this.getStyleForSelectable(corresponding.selectable),
        ];
      })
    );

    return {
      type: selectable.originalNode.type,
      props: {
        id: refID ?? "TODO",
        ...this.getStyleForSelectable(selectable),
        ...(Object.keys(variantStyles).length > 0
          ? { variants: variantStyles }
          : {}),
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
          overrides[refID] = this.toHumanReadableStyle(selectable.selfStyle);
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
      ...this.toHumanReadableStyle(selectable.selfStyle),
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

  relativePathFromPage(filePath: string): string {
    const pagePath = this.component.page?.filePath ?? "";
    const relativePath = path.relative(path.dirname(pagePath), filePath);
    if (!relativePath.startsWith(".")) {
      return "./" + relativePath;
    }
    return relativePath;
  }

  pathForExport(page: Page, name: string) {
    return this.relativePathFromPage(page.filePath) + ".uimix#" + name;
  }

  transformColor(color: Color): Color {
    if (typeof color === "object") {
      const project = this.component.project;
      const token = project.colorTokens.get(color.id);
      if (token?.type === "normal" && token.page) {
        return {
          type: "token",
          id: this.pathForExport(
            token.page,
            generateLowerJSIdentifier(token.name ?? "")
          ),
        };
      }
    }
    return color;
  }

  transformFill(fill: SolidFill): SolidFill {
    return {
      type: "solid",
      color: this.transformColor(fill.color),
    };
  }

  toHumanReadableStyle(
    style: Partial<StyleJSON>
  ): Partial<HumanReadable.BaseStyleProps> {
    const mainComponent =
      style.mainComponent != null
        ? this.component.project.componentForID(style.mainComponent)
        : undefined;

    const mainComponentPath =
      mainComponent &&
      mainComponent.page &&
      this.pathForExport(mainComponent.page, mainComponent.name);

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

      fills: style.fills?.map((fill) => this.transformFill(fill)),
      border: style.border && this.transformFill(style.border),
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

      image:
        style.imageHash &&
        this.relativePathFromPage("src/images/" + style.imageHash + ".png"),

      svg: style.svgContent,

      component: style.foreignComponent
        ? `${this.relativePathFromPage(style.foreignComponent.path)}#${
            style.foreignComponent.name
          }`
        : mainComponentPath,
      componentType: style.foreignComponent?.type,
      props: style.foreignComponent?.props,

      tagName: style.tagName,
    };
  }
}

// e.g., "hover" or "maxWidth:767"
function variantConditionToText(condition: VariantCondition): string {
  if (condition.type === "maxWidth") {
    return `maxWidth:${condition.value}`;
  }
  return condition.type;
}
