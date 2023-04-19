import * as HumanReadable from "./HumanReadableFormat";
import { Page } from "@uimix/model/src/models/Page";
import { compact } from "lodash-es";
import { Color, SolidFill, StyleJSON } from "@uimix/model/src/data/v1";
import { Selectable, Component, Project } from "@uimix/model/src/models";
import { generateLowerJSIdentifier } from "@uimix/foundation/src/utils/Name";
import { posix as path } from "path-browserify";
import { filterUndefined, variantConditionToText } from "./util";

export class OldProjectEmitter {
  constructor(project: Project) {
    this.project = project;
  }

  project: Project;

  emit(): Map<string, HumanReadable.PageNode> {
    const result = new Map<string, HumanReadable.PageNode>();
    for (const page of this.project.pages.all) {
      const pageEmitter = new PageEmitter(page);
      const pageNode = pageEmitter.emit();
      const pagePath = page.filePath;
      result.set(pagePath, pageNode);
    }
    return result;
  }
}

export class PageEmitter {
  constructor(page: Page) {
    this.page = page;
  }

  page: Page;

  get project(): Project {
    return this.page.project;
  }

  emit(): HumanReadable.PageNode {
    return {
      type: "page",
      children: [
        ...this.page.selectable.children.map((child) => {
          const component = Component.from(child.originalNode);

          if (component) {
            return new ComponentEmitter(this, component).emit();
          } else {
            return this.emitNode(child, new Map<string, string>());
          }
        }),
        ...this.page.colorTokens.all.map((token) => ({
          type: "colorToken" as const,
          props: {
            id: generateLowerJSIdentifier(token.name ?? ""),
            name: token.name ?? "",
            value: token.value?.toString() ?? "",
          },
        })),
      ],
    };
  }

  emitNode(
    selectable: Selectable,
    refIDs: Map<string, string>
  ): HumanReadable.SceneNode {
    const variants = selectable.variantCorrespondings.filter(
      (corresponding) => corresponding.variant
    );

    const refID = refIDs?.get(selectable.originalNode.id);

    const children =
      selectable.originalNode.type === "instance"
        ? []
        : selectable.children.map((child) => this.emitNode(child, refIDs));

    const variantStyles = Object.fromEntries(
      variants.map((corresponding) => {
        return [
          variantConditionToText(corresponding.variant!.condition!),
          this.getStyleForSelectable(corresponding.selectable),
        ];
      })
    );

    return {
      // TODO: better typing
      type: selectable.originalNode.type as HumanReadable.SceneNode["type"],
      props: {
        id: refID ?? "",
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

  relativePathFromPage(filePath: string): string {
    const pagePath = this.page.filePath;
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
      const token = this.project.colorTokens.get(color.id);
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
        ? this.project.componentForID(style.mainComponent)
        : undefined;

    const mainComponentPath =
      mainComponent &&
      mainComponent.page &&
      this.pathForExport(mainComponent.page, mainComponent.name);

    return filterUndefined<Partial<HumanReadable.BaseStyleProps>>({
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
    });
  }
}

export class ComponentEmitter {
  constructor(pageEmitter: PageEmitter, component: Component) {
    this.pageEmitter = pageEmitter;
    this.component = component;
    this.refIDs = component.refIDs;
  }

  pageEmitter: PageEmitter;
  component: Component;
  refIDs: Map<string, string>;

  emit(): HumanReadable.ComponentNode {
    return {
      type: "component",
      props: {
        id: this.component.name,
      },
      children: [
        this.pageEmitter.emitNode(
          this.component.rootNode.selectable,
          this.refIDs
        ),
        ...this.emitVariants(),
      ],
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
