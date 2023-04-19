import {
  ColorToken,
  Component,
  Node,
  Page,
  Project,
  Selectable,
} from "@uimix/model/src/models";
import * as HumanReadable from "./HumanReadableFormat";
import * as Data from "@uimix/model/src/data/v1";
import { posix as path } from "path-browserify";
import { filterUndefined, variantConditionToText } from "./util";
import { Color } from "@uimix/foundation/src/utils/Color";
import { generateLowerJSIdentifier } from "@uimix/foundation/src/utils/Name";

export class ProjectLoader2 {
  constructor() {
    this.project = new Project();
  }

  project: Project;
  pathToComponent = new Map<
    string, // path to component from root (e.g., "src/components.uimix#Button")
    Component
  >();
  pathToColorToken = new Map<
    string, // path to token from root (e.g., "src/components.uimix#color1")
    ColorToken
  >();
  componentToRefIDs = new Map<
    string /* component ID */,
    Map<string /* node ID */, string /* human-readable ref id */>
  >();

  load(files: Map<string, HumanReadable.PageNode>) {
    const pageLoaders: PageLoader[] = [];

    for (const [pageName, pageNode] of files) {
      const page = this.project.pages.create(pageName);
      const pageLoader = new PageLoader(this, page);
      pageLoader.load(pageNode);
      pageLoaders.push(pageLoader);
    }

    for (const pageLoader of pageLoaders) {
      pageLoader.loadStyles();
    }
  }
}

class PageLoader {
  constructor(projectLoader: ProjectLoader2, page: Page) {
    this.projectLoader = projectLoader;
    this.page = page;
  }

  projectLoader: ProjectLoader2;
  page: Page;
  nodeToInput = new Map<Node, HumanReadable.SceneNode>();

  get project() {
    return this.page.project;
  }

  get filePath() {
    return this.page.filePath + ".uimix";
  }

  load(inputNode: HumanReadable.PageNode) {
    const children: Node[] = [];

    for (const inputChild of inputNode.children) {
      if (inputChild.type === "colorToken") {
        const token = this.page.colorTokens.add();
        token.name = inputChild.props.name;
        token.value = Color.from(inputChild.props.value);

        this.projectLoader.pathToColorToken.set(
          this.filePath + "#" + generateLowerJSIdentifier(token.name),
          token
        );
      } else if (inputChild.type === "component") {
        children.push(this.loadComponent(inputChild));
      } else {
        children.push(this.loadNode(inputChild, new Map<string, string>()));
      }
    }

    this.page.node.append(children);
  }

  loadNode(
    inputNode: HumanReadable.SceneNode,
    refIDs: Map<string, string>
  ): Node {
    const node = this.project.nodes.create(inputNode.type);
    node.name = inputNode.props.name;
    const children = inputNode.children.map((child) =>
      this.loadNode(child, refIDs)
    );
    node.append(children);

    this.nodeToInput.set(node, inputNode);
    refIDs.set(node.id, inputNode.props.id);

    return node;
  }

  loadComponent(inputNode: HumanReadable.ComponentNode): Node {
    const componentNode = this.project.nodes.create("component");
    componentNode.name = inputNode.props.name;

    const refIDs = new Map<string, string>();
    this.projectLoader.componentToRefIDs.set(componentNode.id, refIDs);

    const children = inputNode.children.map((child) => {
      if (child.type === "variant") {
        const variantNode = this.project.nodes.create("variant");
        variantNode.condition = child.props.condition;
        return variantNode;
      } else {
        return this.loadNode(child, refIDs);
      }
    });

    // TODO: bulk append
    for (const child of children) {
      componentNode.append([child]);
    }

    this.projectLoader.pathToComponent.set(
      this.filePath + "#" + inputNode.props.id,
      Component.from(componentNode)!
    );

    return componentNode;
  }

  loadStyles() {
    for (const [node, inputNode] of this.nodeToInput) {
      const selectable = node.selectable;
      this.loadStyleForSelectable(selectable, inputNode.props);

      for (const corresponding of selectable.variantCorrespondings) {
        if (corresponding.variant?.condition) {
          const variantText = variantConditionToText(
            corresponding.variant.condition
          );
          const variantStyle = inputNode.props.variants?.[variantText];
          if (variantStyle) {
            this.loadStyleForSelectable(corresponding.selectable, variantStyle);
          }
        }
      }
    }
  }

  loadInstanceOverrides(
    instanceSelectable: Selectable,
    overrides: Record<string, HumanReadable.StyleProps>
  ) {
    const mainComponent = instanceSelectable.mainComponent;
    if (!mainComponent) {
      return;
    }

    const refIDs =
      this.projectLoader.componentToRefIDs.get(mainComponent.id) ??
      new Map<string, string>();

    const visit = (selectable: Selectable) => {
      const refID = refIDs.get(selectable.originalNode.id);
      if (refID) {
        selectable.selfStyle.loadJSON(
          this.transformStyle(overrides[refID] ?? {})
        );
      }

      if (selectable.originalNode.type === "instance") {
        this.loadInstanceOverrides(
          selectable,
          overrides[refID!].overrides ?? {}
        );
      } else {
        selectable.children.forEach(visit);
      }
    };

    instanceSelectable.children.forEach(visit);
  }

  loadStyleForSelectable(
    selectable: Selectable,
    style: HumanReadable.StyleProps
  ) {
    selectable.selfStyle.loadJSON(this.transformStyle(style));

    if (selectable.originalNode.type === "instance" && style.overrides) {
      this.loadInstanceOverrides(selectable, style.overrides ?? {});
    }
  }

  // Get id from relative path of components/tokens
  componentFromRelativePath(relativePath: string): Component | undefined {
    const absPath = path.join(path.dirname(this.filePath), relativePath);
    return this.projectLoader.pathToComponent.get(absPath);
  }

  colorTokenFromRelativePath(relativePath: string): ColorToken | undefined {
    const absPath = path.join(path.dirname(this.filePath), relativePath);
    return this.projectLoader.pathToColorToken.get(absPath);
  }

  transformColor(color: Data.Color): Data.Color {
    if (typeof color === "object") {
      const tokenPath = color.id;
      const tokenId = this.colorTokenFromRelativePath(tokenPath)?.id;

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

  transformFill(fill: Data.SolidFill): Data.SolidFill {
    return {
      type: "solid",
      color: this.transformColor(fill.color),
    };
  }

  transformPosition(
    position: HumanReadable.Position
  ): Data.PositionConstraints {
    return {
      x:
        position.left !== undefined && position.right !== undefined
          ? { type: "both", start: position.left, end: position.right }
          : position.right !== undefined
          ? { type: "end", end: position.right }
          : { type: "start", start: position.left ?? 0 },
      y:
        position.top !== undefined && position.bottom !== undefined
          ? { type: "both", start: position.top, end: position.bottom }
          : position.bottom !== undefined
          ? { type: "end", end: position.bottom }
          : { type: "start", start: position.top ?? 0 },
    };
  }

  getImageHashFromImagePath(imagePath: string): string {
    // TODO: improve
    return path.basename(imagePath, path.extname(imagePath));
  }

  transformStyle(
    style: Partial<HumanReadable.BaseStyleProps>
  ): Partial<Data.StyleJSON> {
    let mainComponentID: string | undefined;
    let foreignComponentRef: Data.ForeignComponentRef | undefined;

    if (style.componentType && style.component) {
      const [filePath, name] = style.component.split("#");
      const absPath = path.join(path.dirname(this.filePath), filePath);

      foreignComponentRef = {
        type: style.componentType,
        path: absPath,
        name,
        props: style.props ?? {},
      };
    } else {
      if (style.component) {
        mainComponentID = this.componentFromRelativePath(style.component)?.node
          .id;
        if (!mainComponentID) {
          console.error(`component ${style.component} not found`);
        }
      }
    }

    return filterUndefined<Partial<Data.StyleJSON>>({
      hidden: style.hidden,
      locked: style.locked,
      position: style.position && this.transformPosition(style.position),
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

function transformPxPercentage(
  pxPercentage: number | string
): Data.PxPercentValue {
  if (typeof pxPercentage === "number") {
    return pxPercentage;
  }
  return [Number.parseFloat(pxPercentage), "%"];
}
