import * as File from "./types";
import { compact } from "lodash-es";
import { Page, Selectable, Component, Project, ColorToken } from "../models";
import * as Data from "../data/v1";
import {
  IncrementalUniqueNameGenerator,
  generateLowerJSIdentifier,
  generateUpperJSIdentifier,
} from "@uimix/foundation/src/utils/Name";
import { posix as path } from "path-browserify";
import { filterUndefined, variantConditionText } from "./util";
import { assertNonNull } from "@uimix/foundation/src/utils/Assert";

export class ProjectEmitter {
  constructor(project: Project, imagePaths: Map<string, string>) {
    this.project = project;
    this.imagePaths = imagePaths;
  }

  project: Project;
  imagePaths: Map<string, string>;
  componentPaths = new Map<
    string,
    {
      path: string;
      readableID: string;
    }
  >();
  colorTokenPaths = new Map<
    string,
    {
      path: string;
      readableID: string;
    }
  >();

  emit(): Map<string, File.PageNode> {
    const pages = this.project.pages.all;

    for (const page of pages) {
      const namer = new IncrementalUniqueNameGenerator();

      for (const component of page.components) {
        const readableID = namer.generate(
          generateUpperJSIdentifier(component.name)
        );
        const path = `${page.filePath}.uimix#${readableID}`;
        this.componentPaths.set(component.id, { path, readableID });
      }
      for (const colorToken of page.colorTokens.all) {
        const readableID = namer.generate(
          generateLowerJSIdentifier(colorToken.name ?? "")
        );
        const path = `${page.filePath}.uimix#${readableID}`;
        this.colorTokenPaths.set(colorToken.id, { path, readableID });
      }
    }

    const result = new Map<string, File.PageNode>();
    for (const page of pages) {
      const pageEmitter = new PageEmitter(this, page);
      const pageNode = pageEmitter.emit();
      const pagePath = page.filePath;
      result.set(pagePath, pageNode);
    }
    return result;
  }
}

export class PageEmitter {
  constructor(projectEmitter: ProjectEmitter, page: Page) {
    this.projectEmitter = projectEmitter;
    this.page = page;
  }

  projectEmitter: ProjectEmitter;
  page: Page;

  get project(): Project {
    return this.page.project;
  }

  emit(): File.PageNode {
    return {
      type: "page",
      children: [
        ...this.page.selectable.children.map((child) => {
          const component = Component.from(child.originalNode);
          if (component) {
            const { readableID } = assertNonNull(
              this.projectEmitter.componentPaths.get(component.id)
            );
            return new ComponentEmitter(this, component, readableID).emit();
          } else {
            return this.emitNode(child, new Map<string, string>());
          }
        }),
        ...this.page.colorTokens.all.map((token) => {
          const { readableID } = assertNonNull(
            this.projectEmitter.colorTokenPaths.get(token.id)
          );

          return {
            type: "colorToken" as const,
            props: {
              id: readableID,
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
    refIDs: Map<string, string>,
    isComponentRoot = false
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
          const style = this.getStyleForSelectable(corresponding.selectable);
          if (Object.keys(style).length === 0) {
            return;
          }
          return [variantConditionText(condition), style];
        })
      )
    );

    const props: File.SceneNode["props"] = {};
    if (refID) {
      props.id = refID;
    }
    if (!isComponentRoot) {
      props.name = node.name;
    }

    Object.assign(props, this.getStyleForSelectable(selectable));

    if (Object.keys(variantStyles).length > 0) {
      props.variants = variantStyles;
    }

    return {
      // TODO: better typing
      type: node.type as File.SceneNode["type"],
      props,
      children,
    };
  }

  getStyleForSelectable(selectable: Selectable): File.StyleProps {
    const style: File.StyleProps = this.transformStyle(selectable.selfStyle);

    if (selectable.originalNode.type === "instance") {
      const overrides = this.getInstanceOverrides(selectable);
      if (Object.keys(overrides).length > 0) {
        style.overrides = overrides;
      }
    }

    return style;
  }

  getInstanceOverrides(
    instanceSelectable: Selectable
  ): Record<string, File.StyleProps> {
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

      const style: File.StyleProps = this.transformStyle(selectable.selfStyle);

      if (selectable.originalNode.type === "instance") {
        const innerOverrides = this.getInstanceOverrides(selectable);
        if (Object.keys(innerOverrides).length > 0) {
          style.overrides = innerOverrides;
        }
      }

      if (Object.keys(style).length > 0) {
        overrides[refID] = style;
      }

      if (selectable.originalNode.type !== "instance") {
        selectable.children.forEach((child) => visit(child));
      }
    };

    instanceSelectable.children.forEach(visit);

    return overrides;
  }

  relativePath(absolutePath: string): string {
    const pagePath = this.page.filePath;
    const relativePath = path.relative(path.dirname(pagePath), absolutePath);
    if (!relativePath.startsWith(".")) {
      return "./" + relativePath;
    }
    return relativePath;
  }

  componentRelativePath(component: Component): string {
    const { path, readableID } = assertNonNull(
      this.projectEmitter.componentPaths.get(component.id)
    );

    if (component.page === this.page) {
      return readableID;
    }
    return this.relativePath(path);
  }

  colorTokenRelativePath(token: ColorToken): string {
    const { path, readableID } = assertNonNull(
      this.projectEmitter.colorTokenPaths.get(token.id)
    );

    if (token.page === this.page) {
      return readableID;
    }
    return this.relativePath(path);
  }

  imageRelativePath(imageHash: string): string | undefined {
    const absPath = this.projectEmitter.imagePaths.get(imageHash);
    if (!absPath) {
      return;
    }
    return this.relativePath(absPath);
  }

  foreignComponentRelativePath(path: string): string {
    if (path.startsWith("/")) {
      // internal
      return this.relativePath(path.slice(1));
    }
    // external
    return path;
  }

  transformColor(color: Data.Color): File.Color {
    if (typeof color === "object") {
      const token = this.project.colorTokens.get(color.id);
      if (token?.type === "normal") {
        return {
          token: this.colorTokenRelativePath(token),
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

  transformStyle(style: Partial<Data.Style>): Partial<File.BaseStyleProps> {
    const mainComponent =
      style.mainComponent != null
        ? this.project.componentForID(style.mainComponent)
        : undefined;

    const mainComponentPath =
      mainComponent &&
      mainComponent.page &&
      this.componentRelativePath(mainComponent);

    return filterUndefined<Partial<File.BaseStyleProps>>({
      hidden: style.hidden,
      locked: style.locked,
      position: style.position,
      preferAbsolute: style.preferAbsolute,
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

      image: style.imageHash && this.imageRelativePath(style.imageHash),
      svg: style.svgContent,

      component: style.foreignComponent
        ? `${this.foreignComponentRelativePath(style.foreignComponent.path)}#${
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
          this.refIDs,
          true
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
