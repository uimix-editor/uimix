import type * as CSS from "csstype";
import type * as hast from "hast";
import { h } from "hastscript";
import { Buffer } from "buffer";

const lineBreakRegExp = /\r\n|[\n\r\u2028\u2029\u0085]/;

export function processCharacters(characters: string): hast.Content[] {
  const lines = characters.split(lineBreakRegExp);
  const results: hast.Content[] = [];
  for (let i = 0; i < lines.length; ++i) {
    if (i !== 0) {
      results.push(h("br"));
    }
    results.push({
      type: "text",
      value: lines[i],
    });
  }
  return results;
}

export type Style = Partial<Record<keyof CSS.Properties, string>>;

export function positionStyle(
  node: SceneNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  groupTopLeft: { x: number; y: number } = { x: 0, y: 0 }
): Style {
  const style: Style = {};

  // TODO: more constraints
  if (parentLayout === "NONE") {
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

export function layoutStyle(node: BaseFrameMixin, borderWidth: number): Style {
  const style: Style = {};

  if (node.layoutMode === "NONE") {
    return {};
  }

  style.display = "flex";
  style.flexDirection = node.layoutMode === "VERTICAL" ? "column" : "row";
  style.columnGap = style.rowGap = node.itemSpacing + "px";
  style.paddingLeft = Math.max(0, node.paddingLeft - borderWidth) + "px";
  style.paddingRight = Math.max(0, node.paddingRight - borderWidth) + "px";
  style.paddingTop = Math.max(0, node.paddingTop - borderWidth) + "px";
  style.paddingBottom = Math.max(0, node.paddingBottom - borderWidth) + "px";

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

  return style;
}

export function fillBorderStyle(
  node: GeometryMixin & RectangleCornerMixin
): Style {
  // TODO: A rectangle with single image fill should be treated as <img> rather than <div> with a background image

  // TODO: support multiple fills
  const fill =
    node.fills !== figma.mixed && node.fills.length ? node.fills[0] : undefined;
  const stroke = node.strokes.length ? node.strokes[0] : undefined;

  // TODO: support gradient and image
  const background = fill?.type === "SOLID" ? solidPaintToHex(fill) : undefined;

  const borderColor =
    stroke?.type === "SOLID" ? solidPaintToHex(stroke) : undefined;
  const borderWidth =
    borderColor && node.strokeWeight ? String(node.strokeWeight) : undefined;

  return {
    background: background,
    borderTopWidth: borderWidth,
    borderRightWidth: borderWidth,
    borderBottomWidth: borderWidth,
    borderLeftWidth: borderWidth,
    borderTopColor: borderColor,
    borderRightColor: borderColor,
    borderBottomColor: borderColor,
    borderLeftColor: borderColor,
    borderTopLeftRadius: `${node.topLeftRadius}px`,
    borderTopRightRadius: `${node.topRightRadius}px`,
    borderBottomLeftRadius: `${node.bottomLeftRadius}px`,
    borderBottomRightRadius: `${node.bottomRightRadius}px`,
  };
}

export function textAlign(align: TextNode["textAlignHorizontal"]): string {
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

export function fontNameStyle(font: FontName): Style {
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

export function solidPaintToHex(solidPaint: SolidPaint): string {
  return rgbaToHex({ ...solidPaint.color, a: solidPaint.opacity ?? 1 });
}

export function rgbaToHex(rgba: RGBA): string {
  const { r, g, b, a } = rgba;
  return (
    "#" +
    (a === 1 ? [r, g, b] : [r, g, b, a])
      .map((c) => {
        const str = Math.round(c * 255)
          .toString(16)
          .toUpperCase();
        return str.length === 1 ? "0" + str : str;
      })
      .join("")
  );
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

const vectorLikeTypes: SceneNode["type"][] = [
  "LINE",
  "ELLIPSE",
  "POLYGON",
  "STAR",
  "VECTOR",
  "BOOLEAN_OPERATION",
];

const isVectorLikeNodeMemo = new WeakMap<SceneNode, boolean>();

export function isVectorLikeNode(node: SceneNode): boolean {
  const memo = isVectorLikeNodeMemo.get(node);
  if (memo != null) {
    return memo;
  }

  let result = false;
  if (vectorLikeTypes.includes(node.type)) {
    result = true;
  } else if ("children" in node) {
    result =
      node.children.length !== 0 && node.children.every(isVectorLikeNode);
  }

  isVectorLikeNodeMemo.set(node, result);
  return result;
}

export function svgToDataURL(svgText: string): string {
  const encoded = encodeURIComponent(svgText)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml,${encoded}`;
}

export function imageToDataURL(data: Uint8Array): string | undefined {
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e) {
    const base64 = Buffer.from(data).toString("base64");
    return "data:image/png;base64," + base64;
  } else {
    console.error("TODO: unsupported image data type");
    return undefined;
  }
}

export function stringifyStyle(style: Style): string {
  const styleString = Object.entries(style)
    .map(([key, value]) => (value != null ? `${key}: ${value};` : ""))
    .join("");

  return styleString;
}

export function generateIDFromText(name: string): string {
  let id = name.replace(/[^a-zA-Z0-9]/g, "");
  if (/^[0-9]/.exec(id)) {
    id = `_${id}`;
  }
  return id.toLowerCase();
}

export function incrementAlphanumeric(str: string): string {
  const numMatches = /[1-9][0-9]*$/.exec(str);
  if (numMatches) {
    const numPart = numMatches[0];
    const strPart = str.slice(0, str.length - numPart.length);

    return `${strPart}${Number.parseInt(numPart) + 1}`;
  }

  return str + "1";
}

export class IDGenerator {
  private ids = new Set<string>();
  maxLength = 20;

  generate(text: string): string {
    let id = generateIDFromText(text).slice(0, this.maxLength);
    while (this.ids.has(id)) {
      id = incrementAlphanumeric(id);
    }
    this.ids.add(id);
    return id;
  }
}
