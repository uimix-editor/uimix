import type * as CSS from "csstype";
import { rgbaToHex, solidPaintToHex } from "./util";

export type Style = Partial<Record<keyof CSS.Properties, string>>;

export function positionStyle(
  node: SceneNode,
  parentLayout: BaseFrameMixin["layoutMode"] | undefined,
  groupTopLeft: { x: number; y: number } = { x: 0, y: 0 }
): Style {
  const style: Style = {};

  // TODO: more constraints
  if (
    parentLayout === "NONE" ||
    ("layoutPositioning" in node && node.layoutPositioning === "ABSOLUTE")
  ) {
    style.position = "absolute";
    style.left = `${node.x - groupTopLeft.x}px`;
    style.top = `${node.y - groupTopLeft.y}px`;
  } else {
    style.position = "relative";
  }

  style.width = `${node.width}px`;
  style.height = `${node.height}px`;

  if ("layoutGrow" in node) {
    if (parentLayout === "VERTICAL") {
      if (node.layoutGrow) {
        style.flexGrow = "1";
        style.height = undefined;
      }
      if (node.layoutAlign === "STRETCH") {
        style.alignSelf = "stretch";
        style.width = undefined;
      }
    } else if (parentLayout === "HORIZONTAL") {
      if (node.layoutGrow) {
        style.flexGrow = "1";
        style.width = undefined;
      }
      if (node.layoutAlign === "STRETCH") {
        style.alignSelf = "stretch";
        style.height = undefined;
      }
    }
  }

  if (node.type === "TEXT") {
    switch (node.textAutoResize) {
      case "WIDTH_AND_HEIGHT":
        style.width = undefined;
        style.height = undefined;
        break;
      case "HEIGHT":
        style.height = undefined;
        break;
      case "NONE":
        break;
    }
  }

  return style;
}

export function layoutStyle(node: BaseFrameMixin): Style {
  const style: Style = {};

  if (node.layoutMode === "NONE") {
    return {};
  }

  style.display = "flex";
  style.flexDirection = node.layoutMode === "VERTICAL" ? "column" : "row";
  style.columnGap = style.rowGap = node.itemSpacing + "px";
  style.paddingLeft = Math.max(0, node.paddingLeft - node.strokeWeight) + "px";
  style.paddingRight =
    Math.max(0, node.paddingRight - node.strokeWeight) + "px";
  style.paddingTop = Math.max(0, node.paddingTop - node.strokeWeight) + "px";
  style.paddingBottom =
    Math.max(0, node.paddingBottom - node.strokeWeight) + "px";

  style.justifyContent = (() => {
    switch (node.primaryAxisAlignItems) {
      case "CENTER":
        return "center";
      case "MAX":
        return "flex-end";
      case "MIN":
        return "flex-start";
      case "SPACE_BETWEEN":
        return "space-between";
    }
  })();
  style.alignItems = (() => {
    switch (node.counterAxisAlignItems) {
      case "CENTER":
        return "center";
      case "MAX":
        return "flex-end";
      case "MIN":
        return "flex-start";
    }
  })();

  if (node.layoutMode === "VERTICAL") {
    if (node.primaryAxisSizingMode == "AUTO") {
      style.height = "fit-content";
    }
    if (node.counterAxisSizingMode == "AUTO") {
      style.width = "fit-content";
    }
  } else {
    if (node.primaryAxisSizingMode == "AUTO") {
      style.width = "fit-content";
    }
    if (node.counterAxisSizingMode == "AUTO") {
      style.height = "fit-content";
    }
  }

  if (node.clipsContent) {
    style.overflow = "hidden";
  }

  return style;
}

export function fillBorderStyle(node: BaseFrameMixin): Style {
  // TODO: A rectangle with single image fill should be treated as <img> rather than <div> with a background image

  // TODO: support multiple fills
  const fill =
    node.fills !== figma.mixed && node.fills.length ? node.fills[0] : undefined;
  const stroke = node.strokes.length ? node.strokes[0] : undefined;

  // TODO: support gradient and image
  const background = fill?.type === "SOLID" ? solidPaintToHex(fill) : undefined;

  const borderColor =
    stroke?.type === "SOLID" ? solidPaintToHex(stroke) : undefined;
  const borderStyle = borderColor ? "solid" : undefined;

  return {
    background,
    ...(borderStyle === "solid"
      ? {
          borderTopStyle: borderStyle,
          borderRightStyle: borderStyle,
          borderBottomStyle: borderStyle,
          borderLeftStyle: borderStyle,
          borderTopWidth: `${node.strokeTopWeight}px`,
          borderRightWidth: `${node.strokeRightWeight}px`,
          borderBottomWidth: `${node.strokeBottomWeight}px`,
          borderLeftWidth: `${node.strokeLeftWeight}px`,
          borderTopColor: borderColor,
          borderRightColor: borderColor,
          borderBottomColor: borderColor,
          borderLeftColor: borderColor,
        }
      : {}),
    borderTopLeftRadius:
      node.topLeftRadius !== 0 ? `${node.topLeftRadius}px` : undefined,
    borderTopRightRadius:
      node.topRightRadius !== 0 ? `${node.topRightRadius}px` : undefined,
    borderBottomLeftRadius:
      node.bottomLeftRadius !== 0 ? `${node.bottomLeftRadius}px` : undefined,
    borderBottomRightRadius:
      node.bottomRightRadius !== 0 ? `${node.bottomRightRadius}px` : undefined,
  };
}

function textAlign(align: TextNode["textAlignHorizontal"]): string {
  switch (align) {
    case "CENTER":
      return "center";
    case "JUSTIFIED":
      return "justify";
    case "LEFT":
      return "left";
    case "RIGHT":
      return "right";
  }
}

const fontWeightForName: Record<string, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

function fontNameStyle(font: FontName): Style {
  const fontFamily = font.family;

  const style = font.style.toLowerCase();
  const styleWithoutItalic = style.replace("italic", "").replace(/\s+/g, "");

  const fontWeight = fontWeightForName[styleWithoutItalic] ?? 400;
  const italic = style.includes("italic");

  return {
    fontFamily,
    fontWeight: fontWeight.toString(),
    fontStyle: italic ? "italic" : undefined,
  };
}

export function textStyle(node: TextNode): Style {
  // TODO: split into spans when font styles are mixed
  const fontSize = node.getRangeFontSize(0, 1);
  const fontName = node.getRangeFontName(0, 1);

  const style: Style = {};
  style.textAlign = textAlign(node.textAlignHorizontal);

  if (fontSize !== figma.mixed) {
    style.fontSize = `${fontSize}px`;
  }
  if (fontName !== figma.mixed) {
    Object.assign(style, fontNameStyle(fontName));
  }

  const fills = node.fills;
  if (fills !== figma.mixed && fills.length && fills[0].type === "SOLID") {
    style.color = rgbaToHex({ ...fills[0].color, a: fills[0].opacity ?? 1 });
  }

  if (node.lineHeight !== figma.mixed && node.lineHeight.unit !== "AUTO") {
    if (node.lineHeight.unit === "PERCENT") {
      style.lineHeight = `${node.lineHeight.value / 100}`;
    } else {
      style.lineHeight = `${node.lineHeight.value}px`;
    }
  }

  const { letterSpacing } = node;
  if (letterSpacing !== figma.mixed && letterSpacing.value !== 0) {
    if (letterSpacing.unit === "PERCENT") {
      style.letterSpacing = `${letterSpacing.value / 100}em`;
    } else if (letterSpacing.unit === "PIXELS") {
      style.letterSpacing = `${letterSpacing.value}px`;
    }
  }

  return style;
}

export function effectStyle(node: BlendMixin): Style {
  return {
    opacity: node.opacity !== 1 ? node.opacity.toString() : undefined,
  };
}

export function stringifyStyle(style: Style): string {
  const styleString = Object.entries(style)
    .map(([key, value]) => (value != null ? `${key}: ${value};` : ""))
    .join("");

  return styleString;
}
