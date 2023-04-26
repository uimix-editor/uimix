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

type PropertiesWithVars = CSS.Properties & {
  [xFlexGrowVarName]?: number;
  [yFlexGrowVarName]?: number;
  [xHeightVarName]?: CSS.Properties["height"];
  [yWidthVarName]?: CSS.Properties["width"];
  [gridWidthVarName]?: CSS.Properties["width"];
  [gridHeightVarName]?: CSS.Properties["height"];
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

  const position = style.position;
  if (position) {
    cssStyle.position = "absolute";
    if (position) {
      cssStyle.left = "start" in position.x ? `${position.x.start}px` : "auto";
      cssStyle.right = "end" in position.x ? `${position.x.end}px` : "auto";
      cssStyle.top = "start" in position.y ? `${position.y.start}px` : "auto";
      cssStyle.bottom = "end" in position.y ? `${position.y.end}px` : "auto";
    }
  } else {
    cssStyle.position = "relative";
  }

  cssStyle.marginTop = `${style.marginTop}px`;
  cssStyle.marginRight = `${style.marginRight}px`;
  cssStyle.marginBottom = `${style.marginBottom}px`;
  cssStyle.marginLeft = `${style.marginLeft}px`;

  // TODO: unset width/height when both left/right or top/bottom are set

  const width = style.width;
  if (width.type === "fill") {
    // polyfill width:stretch
    cssStyle[xFlexGrowVarName] = 1;
    cssStyle[yWidthVarName] = cssStyle[gridWidthVarName] = `calc(100% - ${
      style.marginLeft + style.marginRight
    }px)`;
    cssStyle.minWidth = width.min !== undefined ? `${width.min}px` : undefined;
    cssStyle.maxWidth = width.max !== undefined ? `${width.max}px` : undefined;
  } else {
    let cssWidth: string;
    if (width.type === "fixed") {
      cssWidth = `${width.value}px`;
    } else {
      cssWidth = "max-content";
    }

    cssStyle[xFlexGrowVarName] = 0;
    cssStyle[yWidthVarName] =
      cssStyle[gridWidthVarName] =
      cssStyle.width =
        cssWidth;
  }

  const height = style.height;
  if (height.type === "fill") {
    // polyfill height:stretch
    cssStyle[yFlexGrowVarName] = 1;
    cssStyle[xHeightVarName] = cssStyle[gridHeightVarName] = `calc(100% - ${
      style.marginTop + style.marginBottom
    }px)`;
    cssStyle.minHeight =
      height.min !== undefined ? `${height.min}px` : undefined;
    cssStyle.maxHeight =
      height.max !== undefined ? `${height.max}px` : undefined;
  } else {
    let cssHeight: string;
    if (height.type === "fixed") {
      cssHeight = `${height.value}px`;
    } else {
      cssHeight = "max-content";
    }

    cssStyle[yFlexGrowVarName] = 0;
    cssStyle[xHeightVarName] =
      cssStyle[gridHeightVarName] =
      cssStyle.height =
        cssHeight;
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
