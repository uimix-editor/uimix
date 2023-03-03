import { NodeType, StyleJSON } from "@uimix/node-data";

export function buildPartialNodeCSS(
  nodeType: NodeType,
  style: Partial<StyleJSON>,
  parentHasLayout?: boolean
): React.CSSProperties {
  if (nodeType === "component") {
    return {};
  }

  const cssStyle: React.CSSProperties = {};

  const position = parentHasLayout ? "relative" : "absolute";
  if (position === "absolute") {
    if (style.position !== undefined) {
      if (style.position.x.type === "start") {
        cssStyle.left = style.position.x.start + "px";
      } else if (style.position.x.type === "end") {
        cssStyle.right = style.position.x.end + "px";
      }
      if (style.position.y.type === "start") {
        cssStyle.top = style.position.y.start + "px";
      } else if (style.position.y.type === "end") {
        cssStyle.bottom = style.position.y.end + "px";
      }
    }
  }

  if (style.width !== undefined) {
    if (style.width.type === "fixed") {
      cssStyle.minWidth = cssStyle.width = style.width.value + "px";
    } else if (style.width.type === "hugContents") {
      cssStyle.minWidth = cssStyle.width = "max-content";
    } else {
      // TODO: max width/height
      cssStyle.minWidth = "0";
      cssStyle.width = "100%";
    }
  }

  if (style.height !== undefined) {
    if (style.height.type === "fixed") {
      cssStyle.minHeight = cssStyle.height = style.height.value + "px";
    } else if (style.height.type === "hugContents") {
      cssStyle.minHeight = cssStyle.height = "max-content";
    } else {
      cssStyle.minHeight = "0";
      cssStyle.height = "100%";
    }
  }

  if (nodeType === "frame") {
    if (style.stackDirection !== undefined) {
      cssStyle.flexDirection = style.stackDirection === "x" ? "row" : "column";
    }

    if (style.stackAlign !== undefined) {
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
    }

    if (style.stackJustify !== undefined) {
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
    }

    if (style.gap !== undefined) {
      cssStyle.gap = style.gap + "px";
    }

    if (style.paddingLeft !== undefined) {
      cssStyle.paddingLeft = style.paddingLeft + "px";
    }
    if (style.paddingRight !== undefined) {
      cssStyle.paddingRight = style.paddingRight + "px";
    }
    if (style.paddingTop !== undefined) {
      cssStyle.paddingTop = style.paddingTop + "px";
    }
    if (style.paddingBottom !== undefined) {
      cssStyle.paddingBottom = style.paddingBottom + "px";
    }

    if (style.fill !== undefined) {
      cssStyle.background = style.fill ?? "transparent";
    }
    if (style.border !== undefined) {
      cssStyle.borderColor = style.border ?? "transparent";
    }
    if (style.borderTopWidth !== undefined) {
      cssStyle.borderTopWidth = style.borderTopWidth + "px";
    }
    if (style.borderRightWidth !== undefined) {
      cssStyle.borderRightWidth = style.borderRightWidth + "px";
    }
    if (style.borderBottomWidth !== undefined) {
      cssStyle.borderBottomWidth = style.borderBottomWidth + "px";
    }
    if (style.borderLeftWidth !== undefined) {
      cssStyle.borderLeftWidth = style.borderLeftWidth + "px";
    }
  }

  if (nodeType === "text") {
    if (style.fill !== undefined) {
      cssStyle.color = style.fill ?? "black";
    }
    if (style.fontFamily !== undefined) {
      cssStyle.fontFamily = style.fontFamily;
    }
    if (style.fontSize !== undefined) {
      cssStyle.fontSize = style.fontSize + "px";
    }
    if (style.fontWeight !== undefined) {
      cssStyle.fontWeight = style.fontWeight;
    }
    if (cssStyle.lineHeight === undefined) {
      cssStyle.lineHeight = style.lineHeight;
    }
    if (style.letterSpacing !== undefined) {
      cssStyle.letterSpacing = style.letterSpacing + "em";
    }
    if (style.textHorizontalAlign !== undefined) {
      cssStyle.textAlign = style.textHorizontalAlign;
    }
    if (style.textVerticalAlign !== undefined) {
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
  }

  return cssStyle;
}

export function buildBaseNodeCSS(
  nodeType: NodeType,
  parentHasLayout?: boolean
): React.CSSProperties {
  const cssStyle: React.CSSProperties = {};

  cssStyle.position = parentHasLayout ? "relative" : "absolute";

  if (nodeType === "frame") {
    cssStyle.display = "flex";
    cssStyle.borderStyle = "solid";
  }

  if (nodeType === "text") {
    cssStyle.whiteSpace = "break-spaces";
    cssStyle.display = "flex";
    cssStyle.flexDirection = "column";
  }

  return cssStyle;
}

export function buildNodeCSS(
  nodeType: NodeType,
  style: StyleJSON,
  parentHasLayout?: boolean
): React.CSSProperties {
  const baseStyle = buildBaseNodeCSS(nodeType, parentHasLayout);
  const partialStyle = buildPartialNodeCSS(nodeType, style, parentHasLayout);
  return { ...baseStyle, ...partialStyle };
}
