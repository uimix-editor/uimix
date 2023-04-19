import * as HumanReadable from "./HumanReadableFormat";
import {
  Color,
  ForeignComponentRef,
  ProjectJSON,
  PxPercentValue,
  SolidFill,
  StyleJSON,
  VariantCondition,
} from "@uimix/model/src/data/v1";
import { generateID } from "@uimix/foundation/src/utils/ID";
import { getPageID } from "@uimix/model/src/data/util";
import { filterUndefined, variantConditionToText } from "./util";
import { posix as path } from "path";
import { assertNonNull } from "@uimix/foundation/src/utils/Assert";

export class ProjectLoader {
  constructor(pages: Map<string, HumanReadable.PageNode>) {
    this.pages = pages;

    for (const [name, page] of pages) {
      for (const child of page.children) {
        if (child.type === "component" || child.type === "colorToken") {
          const path = name + ".uimix#" + child.props.id;
          console.log("registering", path);
          this.pathToID.set(path, generateID()); // TODO: reuse ID
        }
      }
    }
  }

  pages: Map<string, HumanReadable.PageNode>;
  json: ProjectJSON = {
    nodes: {
      project: {
        type: "project",
        index: 0,
      },
    },
    styles: {},
    componentURLs: [],
    images: {},
    colors: {},
  };
  pathToID = new Map<string, string>();

  load(): void {
    for (const [name, page] of this.pages.entries()) {
      const pageLoader = new PageLoader(this, name, page);
      pageLoader.load();
    }
  }
}

class PageLoader {
  constructor(
    projectLoader: ProjectLoader,
    pageName: string,
    pageNode: HumanReadable.PageNode
  ) {
    this.projectLoader = projectLoader;
    this.pageName = pageName;
    this.pageNode = pageNode;
  }

  projectLoader: ProjectLoader;
  pageName: string;
  pageNode: HumanReadable.PageNode;

  load() {
    const projectJSON = this.projectLoader.json;
    const id = getPageID(this.pageName);

    projectJSON.nodes[id] = {
      type: "page",
      name: this.pageName,
      parent: "project",
      index: 0,
    };

    for (const [i, childNode] of this.pageNode.children.entries()) {
      if (childNode.type === "component") {
        this.loadComponent(childNode, id, i);
        continue;
      }
      if (childNode.type === "colorToken") {
        const colorID = assertNonNull(
          this.projectLoader.pathToID.get(
            this.pageName + ".uimix#" + childNode.props.id
          )
        );

        projectJSON.colors[colorID] = {
          name: childNode.props.name,
          value: childNode.props.value,
          index: i,
          page: id,
        };
        continue;
      }
      this.loadNode([], childNode, id, i);
    }
  }

  loadComponent(
    component: HumanReadable.ComponentNode,
    parent: string,
    index: number
  ) {
    const projectJSON = this.projectLoader.json;

    const id = assertNonNull(
      this.projectLoader.pathToID.get(
        this.pageName + ".uimix#" + component.props.id
      )
    );

    projectJSON.nodes[id] = {
      type: "component",
      name: component.props.id,
      parent,
      index,
    };

    const variants: {
      id: string;
      condition: VariantCondition;
    }[] = [];

    for (const [i, childNode] of component.children.entries()) {
      if (childNode.type === "variant") {
        const id = generateID();
        projectJSON.nodes[id] = {
          type: "variant",
          condition: childNode.props.condition,
          parent: id,
          index: i,
        };
        variants.push({ id, condition: childNode.props.condition });
      }
    }

    for (const [i, childNode] of component.children.entries()) {
      if (childNode.type !== "variant") {
        this.loadNode(variants, childNode, id, i);
      }
    }
  }

  loadNode(
    variants: {
      id: string;
      condition: VariantCondition;
    }[],
    node: HumanReadable.SceneNode,
    parent: string,
    index: number
  ) {
    const projectJSON = this.projectLoader.json;

    // TODO: reuse id if possible
    const id = generateID();

    projectJSON.nodes[id] = {
      type: node.type,
      name: node.props.id,
      parent,
      index,
    };

    projectJSON.styles[id] = this.transformStyle(node.props);

    for (const [variantText, variantStyle] of Object.entries(
      node.props.variants ?? {}
    )) {
      const variantID = variants.find(
        (v) => variantConditionToText(v.condition) == variantText
      )?.id;
      if (!variantID) {
        console.error(`variant ${variantText} not found`);
      }

      const idPath =
        projectJSON.nodes[parent].type === "component"
          ? [variantID]
          : [variantID, id];

      console.log(idPath);

      projectJSON.styles[idPath.join(":")] = this.transformStyle(variantStyle);
    }

    // TODO: load variants

    for (const [i, childNode] of node.children.entries()) {
      this.loadNode(variants, childNode, id, i);
    }
  }

  // Get id from relative path of components/tokens
  idFromRelativePath(relativePath: string): string | undefined {
    const absPath = path.join(path.dirname(this.pageName), relativePath);
    return this.projectLoader.pathToID.get(absPath);
  }

  transformColor(color: Color): Color {
    if (typeof color === "object") {
      const tokenPath = color.id;
      const tokenId = this.idFromRelativePath(tokenPath);
      if (!tokenId) {
        console.error(`token ${tokenPath} not found`);
        return {
          type: "token",
          id: tokenPath,
        };
      } else {
        return {
          type: "token",
          id: tokenId,
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

  getImageHashFromImagePath(imagePath: string): string {
    // TODO: improve
    return path.basename(imagePath, path.extname(imagePath));
  }

  transformStyle(style: HumanReadable.StyleProps): Partial<StyleJSON> {
    let mainComponentID: string | undefined;
    let foreignComponentRef: ForeignComponentRef | undefined;

    if (style.componentType && style.component) {
      const [path, name] = style.component.split("#");

      foreignComponentRef = {
        type: style.componentType,
        path,
        name,
        props: style.props ?? {},
      };
    } else {
      if (style.component) {
        mainComponentID = this.idFromRelativePath(style.component);
        if (!mainComponentID) {
          console.error(`component ${style.component} not found`);
        }
      }
    }

    return filterUndefined<Partial<StyleJSON>>({
      hidden: style.hidden,
      locked: style.locked,
      position: style.position && {
        x: style.position[0],
        y: style.position[1],
      },
      absolute: style.absolute,
      width: style.width,
      height: style.height,

      topLeftRadius: style.topLeftRadius,
      topRightRadius: style.topRightRadius,
      bottomRightRadius: style.bottomRightRadius,
      bottomLeftRadius: style.bottomLeftRadius,

      fills: style.fills && style.fills.map((fill) => this.transformFill(fill)),
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
        style.lineHeight != null
          ? transformPxPercentage(style.lineHeight)
          : style.lineHeight,
      letterSpacing:
        style.letterSpacing != null
          ? transformPxPercentage(style.letterSpacing)
          : style.letterSpacing,
      textHorizontalAlign: style.textHorizontalAlign,
      textVerticalAlign: style.textVerticalAlign,

      imageHash: style.image && this.getImageHashFromImagePath(style.image),
      svgContent: style.svg,

      mainComponent: mainComponentID,
      foreignComponent: foreignComponentRef,

      tagName: style.tagName,
    });
  }
}

function transformPxPercentage(pxPercentage: number | string): PxPercentValue {
  if (typeof pxPercentage === "number") {
    return pxPercentage;
  }
  return [Number.parseFloat(pxPercentage), "%"];
}
