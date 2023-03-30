import * as UIMix from "@uimix/node-data";
import { getURLSafeBase64Hash, imageToDataURL, rgbaToHex } from "../util";

function getPositionStylePartial(
  node: SceneNode & LayoutMixin,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Partial<UIMix.StyleJSON> {
  const style: Partial<UIMix.StyleJSON> = {};

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
      style.height = { type: "fill" };
    }
    if (node.layoutAlign === "STRETCH") {
      style.width = { type: "fill" };
    }
  } else if (parentLayout === "HORIZONTAL") {
    if (node.layoutGrow) {
      style.width = { type: "fill" };
    }
    if (node.layoutAlign === "STRETCH") {
      style.height = { type: "fill" };
    }
  }

  if (node.type === "TEXT") {
    switch (node.textAutoResize) {
      case "WIDTH_AND_HEIGHT":
        style.width = { type: "hug" };
        style.height = { type: "hug" };
        break;
      case "HEIGHT":
        style.height = { type: "hug" };
        break;
      case "NONE":
        break;
    }
  }

  if ("opacity" in node) {
    style.opacity = node.opacity;
  }
  if ("clipsContent" in node) {
    style.overflowHidden = node.clipsContent;
  }

  return style;
}

async function paintToUIMix(
  paint: Paint
): Promise<UIMix.SolidFill | undefined> {
  if (!paint.visible) {
    return;
  }

  switch (paint.type) {
    case "SOLID":
      return {
        type: "solid",
        color: rgbaToHex({ ...paint.color, a: paint.opacity }),
      };
    /* TODO
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
    */
  }
}

async function paintsToUIMix(
  paints: readonly Paint[]
): Promise<UIMix.SolidFill[]> {
  const fills: UIMix.SolidFill[] = [];
  for (const paint of paints) {
    const fillStyle = await paintToUIMix(paint);
    if (fillStyle) {
      fills.push(fillStyle);
    }
  }
  return fills.reverse();
}

async function getFillBorderStylePartial(
  node: GeometryMixin & BlendMixin & IndividualStrokesMixin
): Promise<Partial<UIMix.StyleJSON>> {
  const style: Partial<UIMix.StyleJSON> = {};

  if (node.fills !== figma.mixed) {
    const fills = await paintsToUIMix(node.fills);
    if (fills.length) {
      style.fills = fills;
    }
  }
  if (node.strokes.length) {
    const border = await paintToUIMix(node.strokes[0]);
    if (border?.type === "solid") {
      style.border = border;
    }
    style.borderTopWidth = node.strokeTopWeight;
    style.borderRightWidth = node.strokeRightWeight;
    style.borderBottomWidth = node.strokeBottomWeight;
    style.borderLeftWidth = node.strokeLeftWeight;
  }

  style.shadows = node.effects.flatMap((effect) => {
    if (effect.type === "DROP_SHADOW" && effect.visible) {
      return [
        {
          color: rgbaToHex(effect.color),
          x: effect.offset.x,
          y: effect.offset.y,
          blur: effect.radius,
          spread: effect.spread ?? 0,
        },
      ];
    }
    return [];
  });

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

function getFontNameStylePartial(font: FontName): {
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

async function getTextStylePartial(
  node: TextNode
): Promise<Partial<UIMix.StyleJSON>> {
  const style: Partial<UIMix.StyleJSON> = {};

  if (node.fontSize !== figma.mixed) {
    style.fontSize = node.fontSize;
  }

  if (node.lineHeight !== figma.mixed) {
    if (node.lineHeight.unit === "AUTO") {
      style.lineHeight = null;
    } else if (node.lineHeight.unit === "PERCENT") {
      style.lineHeight = [node.lineHeight.value, "%"];
    } else {
      style.lineHeight = node.lineHeight.value;
    }
  }

  if (node.letterSpacing !== figma.mixed) {
    if (node.letterSpacing.unit === "PERCENT") {
      style.letterSpacing = [node.letterSpacing.value, "%"];
    } else {
      style.letterSpacing = node.letterSpacing.value;
    }
  }

  let fills = node.fills;
  if (fills === figma.mixed) {
    fills = node.getRangeFills(0, 1);
  }
  if (fills !== figma.mixed) {
    style.fills = await paintsToUIMix(fills);
  }

  if (node.fontName !== figma.mixed) {
    Object.assign(style, getFontNameStylePartial(node.fontName));
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
      style.height = { type: "hug" };
      break;
    case "WIDTH_AND_HEIGHT":
      style.width = { type: "hug" };
      style.height = { type: "hug" };
      break;
  }

  style.textContent = applyTextCase(
    node.characters,
    node.textCase === figma.mixed ? "ORIGINAL" : node.textCase
  );

  return style;
}

function applyTextCase(text: string, textCase: TextCase): string {
  switch (textCase) {
    default:
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

function getLayoutStylePartial(
  node: BaseFrameMixin & IndividualStrokesMixin
): Partial<UIMix.StyleJSON> {
  const style: Partial<UIMix.StyleJSON> = {};

  if (node.layoutMode === "NONE") {
    return {};
  }

  style.layout = "flex";
  style.flexDirection = node.layoutMode === "VERTICAL" ? "y" : "x";
  style.rowGap = node.itemSpacing;
  style.columnGap = node.itemSpacing;
  if (
    node.strokesIncludedInLayout ||
    node.strokes.filter((s) => s.visible).length === 0
  ) {
    style.paddingLeft = node.paddingLeft;
    style.paddingRight = node.paddingRight;
    style.paddingTop = node.paddingTop;
    style.paddingBottom = node.paddingBottom;
  } else {
    style.paddingLeft = Math.max(0, node.paddingLeft - node.strokeLeftWeight);
    style.paddingRight = Math.max(
      0,
      node.paddingRight - node.strokeRightWeight
    );
    style.paddingTop = Math.max(0, node.paddingTop - node.strokeTopWeight);
    style.paddingBottom = Math.max(
      0,
      node.paddingBottom - node.strokeBottomWeight
    );
  }

  style.flexJustify = (() => {
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
  style.flexAlign = (() => {
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
      style.height = { type: "hug" };
    }
    if (node.counterAxisSizingMode == "AUTO") {
      style.width = { type: "hug" };
    }
  } else {
    if (node.primaryAxisSizingMode == "AUTO") {
      style.width = { type: "hug" };
    }
    if (node.counterAxisSizingMode == "AUTO") {
      style.height = { type: "hug" };
    }
  }

  return style;
}

function getCornerStylePartial(
  node: RectangleCornerMixin
): Partial<UIMix.StyleJSON> {
  return {
    topLeftRadius: node.topLeftRadius,
    topRightRadius: node.topRightRadius,
    bottomLeftRadius: node.bottomLeftRadius,
    bottomRightRadius: node.bottomRightRadius,
  };
}

export async function getGroupStyle(
  node: GroupNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Partial<UIMix.StyleJSON>> {
  return {
    ...getPositionStylePartial(node, parentLayout, offset),
  };
}

export async function getFrameStyle(
  node: FrameNode | ComponentNode | ComponentSetNode | InstanceNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Partial<UIMix.StyleJSON>> {
  return {
    ...getPositionStylePartial(node, parentLayout, offset),
    ...getLayoutStylePartial(node),
    ...getCornerStylePartial(node),
    ...(await getFillBorderStylePartial(node)),
  };
}

export async function getTextStyle(
  node: TextNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Partial<UIMix.StyleJSON>> {
  return {
    ...getPositionStylePartial(node, parentLayout, offset),
    ...(await getTextStylePartial(node)),
  };
}

export async function getSVGStyle(
  node: SceneNode & LayoutMixin,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Partial<UIMix.StyleJSON>> {
  return {
    ...getPositionStylePartial(node, parentLayout, offset),
  };
}

export async function getImageStyle(
  images: Map<string, UIMix.Image>,
  node: RectangleNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Partial<UIMix.StyleJSON>> {
  const baseStyle: Partial<UIMix.StyleJSON> = {
    ...getPositionStylePartial(node, parentLayout, offset),
    ...getCornerStylePartial(node),
    ...(await getFillBorderStylePartial(node)),
    overflowHidden: true,
  };

  if (node.fills === figma.mixed || node.fills.length === 0) {
    return baseStyle;
  }

  const fill = node.fills[0];
  if (fill.type !== "IMAGE" || !fill.imageHash) {
    return baseStyle;
  }

  const image = figma.getImageByHash(fill.imageHash);
  if (!image) {
    return baseStyle;
  }

  const [data, size] = await Promise.all([
    image.getBytesAsync(),
    image.getSizeAsync(),
  ]);

  const hash = getURLSafeBase64Hash(data);
  const dataURL = imageToDataURL(data);
  if (!dataURL) {
    return baseStyle;
  }

  images.set(hash, {
    width: size.width,
    height: size.height,
    url: dataURL,
    type: dataURL.startsWith("data:image/jpeg") ? "image/jpeg" : "image/png",
  });

  return {
    ...baseStyle,
    imageHash: hash,
  };
}
