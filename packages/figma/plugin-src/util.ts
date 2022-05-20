import type * as CSS from "csstype";
import type * as hast from "hast";
import { h } from "hastscript";

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

export function layoutStyle(node: SceneNode, groupTopLeft: Vector): Style {
  return {
    position: "absolute",
    left: `${node.x - groupTopLeft.x}px`,
    top: `${node.y - groupTopLeft.y}px`,
    width: `${node.width}px`,
    height: `${node.height}px`,
  };
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

export function fontNameStyle(font: FontName): Style {
  const fontFamily = font.family;
  let fontWeight = "400";
  let fontStyle = "normal";

  switch (font.style.toLowerCase()) {
    case "black": {
      fontWeight = "900";
      break;
    }
    case "heavy": {
      fontWeight = "800";
      break;
    }
    case "bold": {
      fontWeight = "700";
      break;
    }
    case "semibold": {
      fontWeight = "600";
      break;
    }
    case "medium": {
      fontWeight = "500";
      break;
    }
    case "regular": {
      fontWeight = "400";
      break;
    }
    case "thin": {
      fontWeight = "300";
      break;
    }
    case "light": {
      fontWeight = "200";
      break;
    }
    case "ultralight": {
      fontWeight = "100";
      break;
    }
    case "extralight": {
      fontWeight = "100";
      break;
    }
    case "italic": {
      fontWeight = "400";
      fontStyle = "italic";
      break;
    }
    case "ultralight italic": {
      fontWeight = "100";
      fontStyle = "italic";
      break;
    }
    case "light italic": {
      fontWeight = "200";
      fontStyle = "italic";
      break;
    }
    case "thin italic": {
      fontWeight = "300";
      fontStyle = "italic";
      break;
    }
    case "regular italic": {
      fontWeight = "400";
      fontStyle = "italic";
      break;
    }
    case "medium italic": {
      fontWeight = "500";
      fontStyle = "italic";
      break;
    }
    case "semibold italic": {
      fontWeight = "600";
      fontStyle = "italic";
      break;
    }
    case "bold italic": {
      fontWeight = "700";
      fontStyle = "italic";
      break;
    }
    case "heavy italic": {
      fontWeight = "800";
      fontStyle = "italic";
      break;
    }
    case "black italic": {
      fontWeight = "900";
      fontStyle = "italic";
      break;
    }
  }

  return { fontFamily, fontWeight, fontStyle };
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
    style.lineHeight = `${node.lineHeight.value}${
      node.lineHeight.unit === "PERCENT" ? "%" : "px"
    }`;
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
