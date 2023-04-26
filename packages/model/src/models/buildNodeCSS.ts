import * as Data from "../data/v1";
import * as CSS from "csstype";

export function getLayoutType(
  style: Data.Style
): Data.StackDirection | "grid" | undefined {
  if (style.layout === "flex") {
    return style.flexDirection;
  }
  if (style.layout === "grid") {
    return "grid";
  }
}

const xFlexGrowVarName = "--uimix-x-flex-grow";
const yFlexGrowVarName = "--uimix-y-flex-grow";
const xHeightVarName = "--uimix-x-height";
const yWidthVarName = "--uimix-y-width";
const gridWidthVarName = "--uimix-grid-width";
const gridHeightVarName = "--uimix-grid-height";
const leftVarName = "--uimix-left";
const rightVarName = "--uimix-right";
const topVarName = "--uimix-top";
const bottomVarName = "--uimix-bottom";

type PropertiesWithVars = CSS.Properties & {
  [xFlexGrowVarName]?: number;
  [yFlexGrowVarName]?: number;
  [xHeightVarName]?: CSS.Properties["height"];
  [yWidthVarName]?: CSS.Properties["width"];
  [gridWidthVarName]?: CSS.Properties["width"];
  [gridHeightVarName]?: CSS.Properties["height"];
  [leftVarName]?: string;
  [rightVarName]?: string;
  [topVarName]?: string;
  [bottomVarName]?: string;
};

export interface SelfAndChildrenCSS {
  self: PropertiesWithVars;
  children: CSS.Properties;
}

export function buildNodeCSS(
  nodeType: Data.NodeType,
  style: Data.Style,
  getColorToken: (id: string) => string
): SelfAndChildrenCSS {
  const resolveColorToken = (color: Data.Color): string => {
    if (typeof color === "string") {
      return color;
    }
    return getColorToken(color.id);
  };

  if (nodeType === "component") {
    return {
      self: {},
      children: {},
    };
  }

  const cssStyle: PropertiesWithVars = {};
  const childrenStyle: CSS.Properties = {};

  if (style.layout === "none") {
    childrenStyle.position = "absolute";
    childrenStyle.left = `var(${leftVarName}, 0)`;
    childrenStyle.right = `var(${rightVarName}, 0)`;
    childrenStyle.top = `var(${topVarName}, auto)`;
    childrenStyle.bottom = `var(${bottomVarName}, auto)`;
  } else {
    childrenStyle.position = "relative";
  }
  if (style.absolute) {
    cssStyle.position = "absolute";
    cssStyle.left = `var(${leftVarName}, 0)`;
    cssStyle.right = `var(${rightVarName}, 0)`;
    cssStyle.top = `var(${topVarName}, auto)`;
    cssStyle.bottom = `var(${bottomVarName}, auto)`;
  }

  const position = style.position;
  if (position) {
    cssStyle[leftVarName] =
      "start" in position.x ? `${position.x.start}px` : "auto";
    cssStyle[rightVarName] =
      "end" in position.x ? `${position.x.end}px` : "auto";
    cssStyle[topVarName] =
      "start" in position.y ? `${position.y.start}px` : "auto";
    cssStyle[bottomVarName] =
      "end" in position.y ? `${position.y.end}px` : "auto";
  }

  cssStyle.marginTop = `${style.marginTop}px`;
  cssStyle.marginRight = `${style.marginRight}px`;
  cssStyle.marginBottom = `${style.marginBottom}px`;
  cssStyle.marginLeft = `${style.marginLeft}px`;

  // TODO: unset width/height when both left/right or top/bottom are set

  const width = style.width;
  if (width.type === "fill") {
    cssStyle[xFlexGrowVarName] = 1;
    cssStyle[yWidthVarName] = cssStyle[gridWidthVarName] = `calc(100% - ${
      style.marginLeft + style.marginRight
    }px)`;
    cssStyle.minWidth = width.min !== undefined ? `${width.min}px` : undefined;
    cssStyle.maxWidth = width.max !== undefined ? `${width.max}px` : undefined;
  } else {
    cssStyle[xFlexGrowVarName] = 0;

    if (width.type === "fixed") {
      cssStyle.width = `${width.value}px`;
    } else if (width.type === "hug") {
      cssStyle.width = "max-content";
    }
  }

  const height = style.height;
  if (height.type === "fill") {
    cssStyle[yFlexGrowVarName] = 1;
    cssStyle[xHeightVarName] = cssStyle[gridHeightVarName] = `calc(100% - ${
      style.marginTop + style.marginBottom
    }px)`;
    cssStyle.minHeight =
      height.min !== undefined ? `${height.min}px` : undefined;
    cssStyle.maxHeight =
      height.max !== undefined ? `${height.max}px` : undefined;
  } else {
    cssStyle[yFlexGrowVarName] = 0;

    if (height.type === "fixed") {
      cssStyle.height = `${height.value}px`;
    } else if (height.type === "hug") {
      cssStyle.height = "max-content";
    }
  }

  cssStyle.opacity = style.opacity;
  cssStyle.overflow = style.overflowHidden ? "hidden" : "visible";

  if (nodeType === "frame") {
    const layout = style.layout;
    if (layout === "flex") {
      cssStyle.display = "flex";
      cssStyle.flexDirection = style.flexDirection === "x" ? "row" : "column";
      cssStyle.alignItems = (() => {
        switch (style.flexAlign) {
          case "start":
            return "flex-start";
          case "center":
            return "center";
          case "end":
            return "flex-end";
        }
      })();
      cssStyle.justifyContent = (() => {
        switch (style.flexJustify) {
          case "start":
            return "flex-start";
          case "center":
            return "center";
          case "end":
            return "flex-end";
          case "spaceBetween":
            return "space-between";
        }
      })();
      cssStyle.rowGap = `${style.rowGap}px`;
      cssStyle.columnGap = `${style.columnGap}px`;

      if (style.flexDirection === "x") {
        childrenStyle.flexGrow = `var(${xFlexGrowVarName})`;
        childrenStyle.height = `var(${xHeightVarName})`;
      } else {
        childrenStyle.flexGrow = `var(${yFlexGrowVarName})`;
        childrenStyle.width = `var(${yWidthVarName})`;
      }
    } else if (layout === "grid") {
      cssStyle.display = "grid";
      const { gridRowCount, gridColumnCount } = style;
      if (gridRowCount !== null) {
        cssStyle.gridTemplateRows = `repeat(${gridRowCount}, 1fr)`;
      }
      if (gridColumnCount !== null) {
        cssStyle.gridTemplateColumns = `repeat(${gridColumnCount}, 1fr)`;
      }
      cssStyle.rowGap = `${style.rowGap}px`;
      cssStyle.columnGap = `${style.columnGap}px`;

      childrenStyle.width = `var(${gridWidthVarName})`;
      childrenStyle.height = `var(${gridHeightVarName})`;
    } else {
      cssStyle.display = "block";
    }
    cssStyle.paddingLeft = `${style.paddingLeft}px`;
    cssStyle.paddingRight = `${style.paddingRight}px`;
    cssStyle.paddingTop = `${style.paddingTop}px`;
    cssStyle.paddingBottom = `${style.paddingBottom}px`;
  }

  if (nodeType === "frame" || nodeType === "image" || nodeType === "svg") {
    const fills = style.fills;
    cssStyle.background = fills.length
      ? resolveColorToken(fills[0].color)
      : "transparent";
    cssStyle.borderStyle = "solid";
    cssStyle.borderColor =
      (style.border && resolveColorToken(style.border.color)) ?? "transparent";
    cssStyle.borderTopWidth = `${style.borderTopWidth}px`;
    cssStyle.borderRightWidth = `${style.borderRightWidth}px`;
    cssStyle.borderBottomWidth = `${style.borderBottomWidth}px`;
    cssStyle.borderLeftWidth = `${style.borderLeftWidth}px`;

    cssStyle.borderTopLeftRadius = `${style.topLeftRadius}px`;
    cssStyle.borderTopRightRadius = `${style.topRightRadius}px`;
    cssStyle.borderBottomRightRadius = `${style.bottomRightRadius}px`;
    cssStyle.borderBottomLeftRadius = `${style.bottomLeftRadius}px`;

    const shadows = style.shadows;
    if (shadows.length === 0) {
      cssStyle.boxShadow = "none";
    } else {
      cssStyle.boxShadow = shadows
        .map((shadow) => {
          const x = `${shadow.x}px`;
          const y = `${shadow.y}px`;
          const blur = `${shadow.blur}px`;
          const spread = `${shadow.spread}px`;
          const color = resolveColorToken(shadow.color);
          return `${x} ${y} ${blur} ${spread} ${color}`;
        })
        .join(", ");
    }
  }

  if (nodeType === "text") {
    cssStyle.whiteSpace = "break-spaces";
    cssStyle.display = "flex";
    cssStyle.flexDirection = "column";
    const fills = style.fills;
    cssStyle.color = fills.length
      ? resolveColorToken(fills[0].color)
      : "transparent";
    cssStyle.fontFamily = style.fontFamily;
    cssStyle.fontSize = `${style.fontSize}px`;
    cssStyle.fontWeight = style.fontWeight;
    const lineHeight = style.lineHeight;
    cssStyle.lineHeight =
      lineHeight === null
        ? "normal"
        : typeof lineHeight === "number"
        ? `${lineHeight}px`
        : lineHeight.join("");
    const letterSpacing = style.letterSpacing;
    cssStyle.letterSpacing =
      typeof letterSpacing === "number"
        ? `${letterSpacing}px`
        : `${letterSpacing[0] / 100}em`;
    cssStyle.textAlign = style.textHorizontalAlign;
    cssStyle.justifyContent = (() => {
      switch (style.textVerticalAlign) {
        case "start":
          return "flex-start";
        case "center":
          return "center";
        case "end":
          return "flex-end";
      }
    })();
  }

  if (style.hidden) {
    cssStyle.display = "none";
  }

  return { self: cssStyle, children: childrenStyle };
}
