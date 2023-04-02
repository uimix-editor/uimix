import { NodeType, StackDirection, StyleJSON } from "@uimix/node-data";

export function getLayoutType(
  style: StyleJSON
): StackDirection | "grid" | undefined {
  if (style.layout === "flex") {
    return style.flexDirection;
  }
  if (style.layout === "grid") {
    return "grid";
  }
}

export function buildNodeCSS(
  nodeType: NodeType,
  style: StyleJSON,
  parentLayout?: StackDirection | "grid"
): React.CSSProperties {
  if (nodeType === "component") {
    return {};
  }

  const cssStyle: React.CSSProperties = {};

  const cssPosition = parentLayout && !style.absolute ? "relative" : "absolute";
  cssStyle.position = cssPosition;
  if (cssPosition === "absolute") {
    const position = style.position;
    if ("start" in position.x) {
      cssStyle.left = `${position.x.start}px`;
    }
    if ("end" in position.x) {
      cssStyle.right = `${position.x.end}px`;
    }

    if ("start" in position.y) {
      cssStyle.top = `${position.y.start}px`;
    }
    if ("end" in position.y) {
      cssStyle.bottom = `${position.y.end}px`;
    }
  } else {
    cssStyle.marginTop = `${style.marginTop}px`;
    cssStyle.marginRight = `${style.marginRight}px`;
    cssStyle.marginBottom = `${style.marginBottom}px`;
    cssStyle.marginLeft = `${style.marginLeft}px`;
  }

  // TODO: unset width/height when both left/right or top/bottom are set

  const width = style.width;
  if (width.type === "fixed") {
    cssStyle.width = `${width.value}px`;
  } else if (width.type === "hug") {
    cssStyle.width = "max-content";
  } else {
    if (parentLayout === "x") {
      cssStyle.flex = 1;
    } else if (parentLayout) {
      cssStyle.width = `calc(100% - ${style.marginLeft + style.marginRight}px)`;
    } else {
      cssStyle.width = "auto";
    }
    cssStyle.minWidth = width.min !== undefined ? `${width.min}px` : undefined;
    cssStyle.maxWidth = width.max !== undefined ? `${width.max}px` : undefined;
  }

  const height = style.height;
  if (height.type === "fixed") {
    cssStyle.height = `${height.value}px`;
  } else if (height.type === "hug") {
    cssStyle.height = "max-content";
  } else {
    if (parentLayout === "y") {
      cssStyle.flex = 1;
    } else if (parentLayout) {
      cssStyle.height = `calc(100% - ${
        style.marginTop + style.marginBottom
      }px)`;
    } else {
      cssStyle.height = "auto";
    }
    cssStyle.minHeight =
      height.min !== undefined ? `${height.min}px` : undefined;
    cssStyle.maxHeight =
      height.max !== undefined ? `${height.max}px` : undefined;
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
    cssStyle.background = fills.length ? fills[0].color : "transparent";
    cssStyle.borderStyle = "solid";
    cssStyle.borderColor = style.border?.color ?? "transparent";
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
          const color = shadow.color;
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
    cssStyle.color = fills.length ? fills[0].color : "transparent";
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

  return cssStyle;
}
