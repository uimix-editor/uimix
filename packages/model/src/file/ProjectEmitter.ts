import * as File from "./types";
import { compact } from "lodash-es";
import { Page, Selectable, Component, Project } from "../models";
import * as Data from "../data/v1";
import {
  generateLowerJSIdentifier,
  generateUpperJSIdentifier,
  getIncrementalUniqueName,
} from "@uimix/foundation/src/utils/Name";
import { posix as path } from "path-browserify";
import { filterUndefined, variantConditionText } from "./util";

export class ProjectEmitter {
  constructor(project: Project) {
    this.project = project;
  }

  project: Project;

  emit(): Map<string, File.PageNode> {
    const result = new Map<string, File.PageNode>();
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

  emit(): File.PageNode {
    const exportNames = new Set<string>();

    return {
      type: "page",
      children: [
        ...this.page.selectable.children.map((child) => {
          const component = Component.from(child.originalNode);
          if (component) {
            const readableID = getIncrementalUniqueName(
              exportNames,
              generateUpperJSIdentifier(component.name)
            );
            return new ComponentEmitter(this, component, readableID).emit();
          } else {
            return this.emitNode(child, new Map<string, string>());
          }
        }),
        ...this.page.colorTokens.all.map((token) => {
          const id = getIncrementalUniqueName(
            exportNames,
            generateLowerJSIdentifier(token.name ?? "")
          );

          return {
            type: "colorToken" as const,
            props: {
              id,
              name: token.name ?? "",
              value: token.value?.toString() ?? "",
            },
          };
        }),
      ],
    };
  }

  emitNode(
    selectable: Selectable,
    refIDs: Map<string, string>
  ): File.SceneNode {
    const node = selectable.originalNode;

    const refID = refIDs?.get(selectable.originalNode.id);

    const children =
      node.type === "instance"
        ? []
        : selectable.children.map((child) => this.emitNode(child, refIDs));

    const variantStyles = Object.fromEntries(
      compact(
        selectable.variantCorrespondings.map((corresponding) => {
          const condition = corresponding.variant?.condition;
          if (!condition) {
            return;
          }
          return [
            variantConditionText(condition),
            this.getStyleForSelectable(corresponding.selectable),
          ];
        })
      )
    );

    return {
      // TODO: better typing
      type: node.type as File.SceneNode["type"],
      props: {
        id: refID ?? "",
        name: node.name,
        ...this.getStyleForSelectable(selectable),
        ...(Object.keys(variantStyles).length > 0
          ? { variants: variantStyles }
          : {}),
      },
      children,
    };
  }

  getStyleForSelectable(selectable: Selectable): File.StyleProps {
    const getInstanceOverrides = (
      instanceSelectable: Selectable
    ): Record<string, File.StyleProps> => {
      const mainComponent = instanceSelectable.mainComponent;
      if (!mainComponent) {
        return {};
      }
      // TODO: cache refIDs
      const refIDs = mainComponent.refIDs;

      const overrides: Record<string, File.StyleProps> = {};

      const visit = (selectable: Selectable) => {
        const refID = refIDs.get(selectable.originalNode.id);
        if (!refID) {
          return;
        }

        overrides[refID] = this.transformStyle(selectable.selfStyle);

        if (selectable.originalNode.type === "instance") {
          overrides[refID]["overrides"] = getInstanceOverrides(selectable);
        } else {
          selectable.children.forEach((child) => visit(child));
        }
      };

      instanceSelectable.children.forEach(visit);

      return overrides;
    };

    return {
      ...this.transformStyle(selectable.selfStyle),
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
    if (this.page === page) {
      return name;
    }
    return this.relativePathFromPage(page.filePath) + ".uimix#" + name;
  }

  transformColor(color: Data.Color): File.Color {
    if (typeof color === "object") {
      const token = this.project.colorTokens.get(color.id);
      if (token?.type === "normal" && token.page) {
        return {
          token: this.pathForExport(
            token.page,
            // TODO: correct color token import name
            generateLowerJSIdentifier(token.name ?? "")
          ),
        };
      }
      return {
        token: color.id,
      };
    }
    return color;
  }

  transformFill(fill: Data.SolidFill): File.Fill {
    return {
      solid: this.transformColor(fill.color),
    };
  }

  transformPosition(position: Data.PositionConstraints): File.Position {
    return {
      left: position.x.type !== "end" ? position.x.start : undefined,
      right: position.x.type !== "start" ? position.x.end : undefined,
      top: position.y.type !== "end" ? position.y.start : undefined,
      bottom: position.y.type !== "start" ? position.y.end : undefined,
    };
  }

  transformSize(size: Data.SizeConstraint): File.Size {
    switch (size.type) {
      case "hug":
        return "hug";
      case "fixed":
        return size.value;
      case "fill":
        return {
          min: size.min ?? 0,
          max: size.max,
        };
    }
  }

  transformStyle(style: Partial<Data.StyleJSON>): Partial<File.BaseStyleProps> {
    const mainComponent =
      style.mainComponent != null
        ? this.project.componentForID(style.mainComponent)
        : undefined;

    const mainComponentPath =
      mainComponent &&
      mainComponent.page &&
      // TODO: correct component import name
      this.pathForExport(mainComponent.page, mainComponent.name);

    return filterUndefined<Partial<File.BaseStyleProps>>({
      hidden: style.hidden,
      locked: style.locked,
      position: style.position && this.transformPosition(style.position),
      absolute: style.absolute,
      width: style.width && this.transformSize(style.width),
      height: style.height && this.transformSize(style.height),

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
  constructor(
    pageEmitter: PageEmitter,
    component: Component,
    componentID: string
  ) {
    this.pageEmitter = pageEmitter;
    this.component = component;
    this.componentID = componentID;
    this.refIDs = component.refIDs;
  }

  pageEmitter: PageEmitter;
  component: Component;
  componentID: string;
  refIDs: Map<string, string>;

  emit(): File.ComponentNode {
    return {
      type: "component",
      props: {
        id: this.componentID,
        name: this.component.name,
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

  emitVariants(): File.VariantNode[] {
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
