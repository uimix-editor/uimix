import { NodeType, StackDirection, StyleJSON } from "@uimix/node-data";

export function buildNodeCSS(
  nodeType: NodeType,
  style: StyleJSON,
  parentStackDirection?: StackDirection
): React.CSSProperties {
  if (nodeType === "component") {
    return {};
  }

  const cssStyle: React.CSSProperties = {};

  const cssPosition = parentStackDirection ? "relative" : "absolute";
  cssStyle.position = cssPosition;
  if (cssPosition === "absolute") {
    const position = style.position;
    if ("start" in position.x) {
      cssStyle.left = position.x.start.join("");
    }
    if ("end" in position.x) {
      cssStyle.right = position.x.end.join("");
    }

    if ("start" in position.y) {
      cssStyle.top = position.y.start.join("");
    }
    if ("end" in position.y) {
      cssStyle.bottom = position.y.end.join("");
    }
  }

  const width = style.width;
  if (width.type === "fixed") {
    cssStyle.width = width.value.join("");
  } else if (width.type === "hugContents") {
    cssStyle.width = "max-content";
  } else {
    if (parentStackDirection === "x") {
      cssStyle.flex = 1;
    } else if (parentStackDirection === "y") {
      cssStyle.alignSelf = "stretch";
    } else {
      cssStyle.width = "auto";
    }
    cssStyle.minWidth = width.min?.join("");
    cssStyle.maxWidth = width.max?.join("");
  }

  const height = style.height;
  if (height.type === "fixed") {
    cssStyle.height = height.value.join("");
  } else if (height.type === "hugContents") {
    cssStyle.height = "max-content";
  } else {
    if (parentStackDirection === "y") {
      cssStyle.flex = 1;
    } else if (parentStackDirection === "x") {
      cssStyle.alignSelf = "stretch";
    } else {
      cssStyle.height = "auto";
    }
    cssStyle.minHeight = height.min?.join("");
    cssStyle.maxHeight = height.max?.join("");
  }

  cssStyle.opacity = style.opacity;
  cssStyle.overflow = style.overflowHidden ? "hidden" : "visible";

  if (nodeType === "frame") {
    cssStyle.display = "flex";
    cssStyle.flexDirection = style.stackDirection === "x" ? "row" : "column";
    cssStyle.alignItems = (() => {
      switch (style.stackAlign) {
        case "start":
          return "flex-start";
        case "center":
          return "center";
        case "end":
          return "flex-end";
      }
    })();
    cssStyle.justifyContent = (() => {
      switch (style.stackJustify) {
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
    cssStyle.gap = style.gap.join("");
    cssStyle.paddingLeft = style.paddingLeft.join("");
    cssStyle.paddingRight = style.paddingRight.join("");
    cssStyle.paddingTop = style.paddingTop.join("");
    cssStyle.paddingBottom = style.paddingBottom.join("");

    const fills = style.fills;
    cssStyle.background = fills.length ? fills[0].hex : "transparent";
    cssStyle.borderStyle = "solid";
    cssStyle.borderColor = style.border?.hex ?? "transparent";
    cssStyle.borderTopWidth = style.borderTopWidth.join("");
    cssStyle.borderRightWidth = style.borderRightWidth.join("");
    cssStyle.borderBottomWidth = style.borderBottomWidth.join("");
    cssStyle.borderLeftWidth = style.borderLeftWidth.join("");

    cssStyle.borderTopLeftRadius = style.topLeftRadius.join("");
    cssStyle.borderTopRightRadius = style.topRightRadius.join("");
    cssStyle.borderBottomRightRadius = style.bottomRightRadius.join("");
    cssStyle.borderBottomLeftRadius = style.bottomLeftRadius.join("");
  }

  if (nodeType === "text") {
    cssStyle.whiteSpace = "break-spaces";
    cssStyle.display = "flex";
    cssStyle.flexDirection = "column";
    const fills = style.fills;
    cssStyle.color = fills.length ? fills[0].hex : "transparent";
    cssStyle.fontFamily = style.fontFamily;
    cssStyle.fontSize = style.fontSize.join("");
    cssStyle.fontWeight = style.fontWeight;
    const lineHeight = style.lineHeight;
    cssStyle.lineHeight =
      lineHeight === null
        ? "normal"
        : lineHeight[1] === "%"
        ? `${lineHeight[0] / 100}`
        : lineHeight.join("");
    const letterSpacing = style.letterSpacing;
    cssStyle.letterSpacing =
      letterSpacing[1] === "%"
        ? `${letterSpacing[0] / 100}em`
        : letterSpacing.join("");
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

  return cssStyle;
}
