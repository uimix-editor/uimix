import { Buffer } from "buffer";
import { MessageToCode, MessageToUI } from "../types/message";
import { compact, IDGenerator, rgbaToHex, transformAngle } from "./util";
import { StyleJSON } from "@uimix/node-data";
import { createId } from "@paralleldrive/cuid2";

const vectorLikeTypes: SceneNode["type"][] = [
  "LINE",
  "ELLIPSE",
  "POLYGON",
  "STAR",
  "VECTOR",
  "BOOLEAN_OPERATION",
];

const isVectorLikeNodeMemo = new WeakMap<SceneNode, boolean>();

function isVectorLikeNode(node: SceneNode): boolean {
  const memo = isVectorLikeNodeMemo.get(node);
  if (memo != null) {
    return memo;
  }

  let result = false;
  if (vectorLikeTypes.includes(node.type)) {
    result = true;
  } else if (
    // non-image rectangle
    node.type === "RECTANGLE" &&
    !isSingleImageFill(node.fills)
  ) {
    result = true;
  } else if ("children" in node) {
    result =
      node.children.length !== 0 && node.children.every(isVectorLikeNode);
  }

  isVectorLikeNodeMemo.set(node, result);
  return result;
}

function isSingleImageFill(
  fills: MinimalFillsMixin["fills"]
): fills is readonly [ImagePaint] {
  return (
    fills !== figma.mixed && fills.length === 1 && fills[0].type === "IMAGE"
  );
}

function getPositionStyle(
  node: SceneNode & LayoutMixin,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Partial<StyleJSON> {
  const style: Partial<StyleJSON> = {};

  style.hidden = !node.visible;

  // TODO: more constraints
  if (parentLayout === "NONE") {
    style.position = {
      x: { type: "start", start: node.x - offset[0] },
      y: { type: "start", start: node.y - offset[1] },
    };
  }
  style.width = { type: "fixed", value: node.width };
  style.height = { type: "fixed", value: node.height };

  if (parentLayout === "VERTICAL") {
    if (node.layoutGrow) {
      style.height = { type: "fillContainer" };
    }
    if (node.layoutAlign === "STRETCH") {
      style.width = { type: "fillContainer" };
    }
  } else if (parentLayout === "HORIZONTAL") {
    if (node.layoutGrow) {
      style.width = { type: "fillContainer" };
    }
    if (node.layoutAlign === "STRETCH") {
      style.height = { type: "fillContainer" };
    }
  }

  if (node.type === "TEXT") {
    switch (node.textAutoResize) {
      case "WIDTH_AND_HEIGHT":
        style.width = { type: "hugContents" };
        style.height = { type: "hugContents" };
        break;
      case "HEIGHT":
        style.height = { type: "hugContents" };
        break;
      case "NONE":
        break;
    }
  }

  return style;
}

/*
async function paintToMacaron(
  paint: Paint
): Promise<
  | Macaron.ColorFillJSON
  | Macaron.LinearGradientFillJSON
  | Macaron.ImageFillJSON
  | undefined
> {
  if (!paint.visible) {
    return;
  }

  switch (paint.type) {
    case "SOLID":
      return {
        type: "color",
        color: rgbaToHex({ ...paint.color, a: paint.opacity }),
      };
    case "GRADIENT_LINEAR": {
      return {
        type: "linear",
        angle:
          -((transformAngle(paint.gradientTransform) * 180) / Math.PI) + 90,
        stops: paint.gradientStops.map((stop) => [
          rgbaToHex(stop.color),
          stop.position,
        ]),
      };
    }
    case "IMAGE": {
      if (!paint.imageHash) {
        return;
      }
      const image = figma.getImageByHash(paint.imageHash);
      if (!image) {
        return;
      }
      const data = await image.getBytesAsync();

      if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e) {
        const base64 = Buffer.from(data).toString("base64");

        let fit: Macaron.ImageFillJSON["fit"];
        switch (paint.scaleMode) {
          case "CROP":
            fit = "cover";
            break;
          case "FILL":
            fit = "cover";
            break;
          case "FIT":
            fit = "contain";
            break;
          case "TILE":
            fit = "repeat";
            break;
        }

        return {
          type: "image",
          image: {
            type: "raster",
            dataURL: "data:image/png;base64," + base64,
          },
          fit,
          position: {
            x: { type: "center" },
            y: { type: "center" },
          },
        };
      } else {
        console.error("TODO: unsupported image data type");
      }
    }
  }
}

async function paintsToMacaron(
  paints: readonly Paint[]
): Promise<Macaron.FillJSON[]> {
  const fills: Macaron.FillJSON[] = [];
  for (const paint of paints) {
    const fillStyle = await paintToMacaron(paint);
    if (fillStyle) {
      fills.push(fillStyle);
    }
  }
  return fills.reverse();
}
*/

async function getFillBorderStyle(
  node: GeometryMixin & BlendMixin
): Promise<Partial<StyleJSON>> {
  const style: Partial<StyleJSON> = {};

  if (node.fills !== figma.mixed) {
    const fills = await paintsToMacaron(node.fills);
    if (fills.length) {
      style.fill = fills;
    }
  }
  if (node.strokes.length) {
    const border = await paintToMacaron(node.strokes[0]);
    if (border?.type === "color") {
      style.border = border;
    }
    style.borderWidth = node.strokeWeight;
  }

  style.opacity = node.opacity;

  return style;
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

export function getFontNameStyle(font: FontName): {
  fontFamily: string;
  fontWeight: number;
  italic?: true;
} {
  const fontFamily = font.family;

  const style = font.style.toLowerCase();
  const styleWithoutItalic = style.replace("italic", "").replace(/\s+/g, "");

  const fontWeight = fontWeightForName[styleWithoutItalic] ?? 400;
  const italic = style.includes("italic");

  return { fontFamily, fontWeight, italic: italic || undefined };
}

async function getTextStyle(node: TextNode): Promise<Partial<StyleJSON>> {
  const style: Partial<StyleJSON> = {};

  if (node.fontSize !== figma.mixed) {
    style.fontSize = node.fontSize;
  }

  if (node.lineHeight !== figma.mixed && node.lineHeight.unit !== "AUTO") {
    if (node.lineHeight.unit === "PERCENT") {
      style.lineHeight = ((style.fontSize ?? 12) * node.lineHeight.value) / 100;
    } else {
      style.lineHeight = node.lineHeight.value;
    }
  }

  if (node.letterSpacing !== figma.mixed) {
    if (node.letterSpacing.unit === "PERCENT") {
      style.letterSpacing = node.letterSpacing.value;
    } else {
      style.letterSpacing =
        (node.letterSpacing.value / (style.fontSize ?? 12)) * 100;
    }
  }

  let fills = node.fills;
  if (fills === figma.mixed) {
    fills = node.getRangeFills(0, 1);
  }
  if (fills !== figma.mixed) {
    const macaronFills = await paintsToMacaron(fills);
    for (const fill of macaronFills) {
      if (fill.type === "color") {
        style.textColor = fill;
        break;
      }
    }
  }

  if (node.fontName !== figma.mixed) {
    Object.assign(style, getFontNameStyle(node.fontName));
  }

  style.textVerticalAlign = (() => {
    switch (node.textAlignVertical) {
      case "TOP":
        return "start";
      case "CENTER":
        return "center";
      case "BOTTOM":
        return "end";
    }
  })();
  style.textHorizontalAlign = (() => {
    switch (node.textAlignHorizontal) {
      case "LEFT":
        return "start";
      case "CENTER":
        return "center";
      case "RIGHT":
        return "end";
      case "JUSTIFIED":
        return "justify";
    }
  })();

  switch (node.textAutoResize) {
    case "NONE":
      break;
    case "HEIGHT":
      style.height = { type: "hugContents" };
      break;
    case "WIDTH_AND_HEIGHT":
      style.width = { type: "hugContents" };
      style.height = { type: "hugContents" };
      break;
  }

  return style;
}

function applyTextCase(text: string, textCase: TextCase): string {
  switch (textCase) {
    case "ORIGINAL":
      return text;
    case "UPPER":
      return text.toUpperCase();
    case "LOWER":
      return text.toLowerCase();
    case "TITLE":
      return text.replace(/\b\w/g, (l) => l.toUpperCase());
  }
}

function getLayoutStyle(
  node: BaseFrameMixin,
  borderWidth: number
): Partial<StyleJSON> {
  const style: Partial<StyleJSON> = {};

  if (node.layoutMode === "NONE") {
    return {};
  }

  style.stackDirection = node.layoutMode === "VERTICAL" ? "y" : "x";
  style.gap = node.itemSpacing;
  style.paddingLeft = Math.max(0, node.paddingLeft - borderWidth);
  style.paddingRight = Math.max(0, node.paddingRight - borderWidth);
  style.paddingTop = Math.max(0, node.paddingTop - borderWidth);
  style.paddingBottom = Math.max(0, node.paddingBottom - borderWidth);

  style.stackJustify = (() => {
    switch (node.primaryAxisAlignItems) {
      case "CENTER":
        return "center";
      case "MAX":
        return "end";
      case "MIN":
        return "start";
      case "SPACE_BETWEEN":
        return "spaceBetween";
    }
  })();
  style.stackAlign = (() => {
    switch (node.counterAxisAlignItems) {
      case "CENTER":
        return "center";
      case "MAX":
        return "end";
      case "MIN":
        return "start";
    }
  })();

  if (node.layoutMode === "VERTICAL") {
    if (node.primaryAxisSizingMode == "AUTO") {
      style.height = { type: "hugContents" };
    }
    if (node.counterAxisSizingMode == "AUTO") {
      style.width = { type: "hugContents" };
    }
  } else {
    if (node.primaryAxisSizingMode == "AUTO") {
      style.width = { type: "hugContents" };
    }
    if (node.counterAxisSizingMode == "AUTO") {
      style.height = { type: "hugContents" };
    }
  }

  return style;
}

function getCornerStyle(node: RectangleCornerMixin): Partial<StyleJSON> {
  return {
    topLeftRadius: node.topLeftRadius,
    topRightRadius: node.topLeftRadius,
    bottomLeftRadius: node.topLeftRadius,
    bottomRightRadius: node.topLeftRadius,
  };
}

async function figmaToMacaron(
  idGenerator: IDGenerator,
  node: SceneNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Macaron.LayerJSON | undefined> {
  // FigJam nodes are not supported
  if (
    node.type === "STICKY" ||
    node.type === "CONNECTOR" ||
    node.type === "SHAPE_WITH_TEXT" ||
    node.type === "CODE_BLOCK" ||
    node.type === "STAMP" ||
    node.type === "WIDGET" ||
    node.type === "EMBED" ||
    node.type === "LINK_UNFURL" ||
    node.type === "MEDIA" ||
    node.type === "WASHI_TAPE" ||
    node.type === "SECTION"
  ) {
    return;
  }

  if (isVectorLikeNode(node)) {
    try {
      const svg = await node.exportAsync({ format: "SVG" });
      const svgText = String.fromCharCode(...svg);

      return {
        type: "image",
        name: idGenerator.generate(node.name),
        ...getPositionStyle(node, parentLayout, offset),
        width: { type: "hugContents" },
        height: { type: "hugContents" },
        image: {
          type: "svg",
          content: svgText,
        },
      };
    } catch (error) {
      console.error(`error exporting ${node.name} to SVG`);
      console.error(String(error));
    }
  }

  switch (node.type) {
    case "GROUP": {
      return {
        type: "frame",
        ...getPositionStyle(node, parentLayout, offset),
        name: idGenerator.generate(node.name),
        children: await figmaNodesToMacaron(
          idGenerator,
          node.children,
          "NONE",
          [node.x, node.y]
        ),
      };
    }
    case "COMPONENT":
    case "COMPONENT_SET":
    case "INSTANCE":
    case "FRAME": {
      const fillBorderStyle = await getFillBorderStyle(node);
      const borderWidth = fillBorderStyle.borderWidth ?? 0;
      return {
        type: node.layoutMode === "NONE" ? "frame" : "stack",
        name: idGenerator.generate(node.name),
        ...getPositionStyle(node, parentLayout, [offset[0], offset[1]]),
        ...getLayoutStyle(node, borderWidth),
        ...getCornerStyle(node),
        ...fillBorderStyle,
        hideOverflow: node.clipsContent,
        children: await figmaNodesToMacaron(
          idGenerator,
          node.children,
          node.layoutMode,
          [borderWidth, borderWidth]
        ),
      };
    }
    case "RECTANGLE": {
      if (isSingleImageFill(node.fills)) {
        // Treat as image
        const fill = await paintToMacaron(node.fills[0]);
        if (fill?.type !== "image") {
          console.error("Fill type must be image");
          return;
        }

        return {
          type: "image",
          name: idGenerator.generate(node.name),
          ...getPositionStyle(node, parentLayout, offset),
          ...getCornerStyle(node),
          ...(await getFillBorderStyle(node)),
          fill: undefined,
          imageFit: fill.fit !== "repeat" ? fill.fit : undefined,
          image: fill.image,
        };
      }

      return {
        type: "frame",
        name: idGenerator.generate(node.name),
        ...getPositionStyle(node, parentLayout, offset),
        ...getCornerStyle(node),
        ...(await getFillBorderStyle(node)),
        children: [],
      };
    }
    case "TEXT": {
      return {
        type: "text",
        name: idGenerator.generate(node.name),
        ...getPositionStyle(node, parentLayout, offset),
        ...(await getTextStyle(node)),
        textContent: applyTextCase(
          node.characters,
          node.textCase === figma.mixed ? "ORIGINAL" : node.textCase
        ),
      };
    }
  }
}

async function figmaNodesToMacaron(
  idGenerator: IDGenerator,
  nodes: readonly SceneNode[],
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Macaron.LayerJSON[]> {
  return compact(
    await Promise.all(
      nodes.map((child) =>
        figmaToMacaron(idGenerator, child, parentLayout, offset)
      )
    )
  );
}

figma.showUI(__html__);

function postMessage(msg: MessageToUI) {
  figma.ui.postMessage(msg);
}

figma.ui.onmessage = async (msg: MessageToCode) => {
  switch (msg.type) {
    case "copy-nodes": {
      if (figma.currentPage.selection.length === 0) {
        figma.notify("Select a layer to copy");
        break;
      }

      const macaronLayers = await figmaNodesToMacaron(
        new IDGenerator(),
        figma.currentPage.selection,
        "NONE",
        [0, 0]
      );
      postMessage({
        type: "copy-data",
        data: JSON.stringify({
          "application/x-macaron-layers": macaronLayers,
        }),
      });
      break;
    }
    case "paste-nodes": {
      throw new Error("TODO: paste nodes");
      break;
    }
    case "notify": {
      figma.notify(msg.message);
      break;
    }
  }
};
