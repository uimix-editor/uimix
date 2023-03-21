import { SolidFill, StyleJSON } from "@uimix/node-data";
import { getURLSafeBase64Hash, imageToDataURL, rgbaToHex } from "../util";

function getPositionStylePartial(
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

async function paintToUIMix(paint: Paint): Promise<SolidFill | undefined> {
  if (!paint.visible) {
    return;
  }

  switch (paint.type) {
    case "SOLID":
      return {
        type: "solid",
        hex: rgbaToHex({ ...paint.color, a: paint.opacity }),
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

async function paintsToUIMix(paints: readonly Paint[]): Promise<SolidFill[]> {
  const fills: SolidFill[] = [];
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
): Promise<Partial<StyleJSON>> {
  const style: Partial<StyleJSON> = {};

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
): Promise<Partial<StyleJSON>> {
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
      style.height = { type: "hugContents" };
      break;
    case "WIDTH_AND_HEIGHT":
      style.width = { type: "hugContents" };
      style.height = { type: "hugContents" };
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
): Partial<StyleJSON> {
  const style: Partial<StyleJSON> = {};

  if (node.layoutMode === "NONE") {
    return {};
  }

  style.stackDirection = node.layoutMode === "VERTICAL" ? "y" : "x";
  style.gap = node.itemSpacing;
  if (node.strokesIncludedInLayout) {
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

function getCornerStylePartial(node: RectangleCornerMixin): Partial<StyleJSON> {
  return {
    topLeftRadius: node.topLeftRadius,
    topRightRadius: node.topLeftRadius,
    bottomLeftRadius: node.topLeftRadius,
    bottomRightRadius: node.topLeftRadius,
  };
}

export async function getGroupStyle(
  node: GroupNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Partial<StyleJSON>> {
  return {
    ...getPositionStylePartial(node, parentLayout, [offset[0], offset[1]]),
  };
}

export async function getFrameStyle(
  node: FrameNode | ComponentNode | ComponentSetNode | InstanceNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Partial<StyleJSON>> {
  return {
    ...getPositionStylePartial(node, parentLayout, [offset[0], offset[1]]),
    ...getLayoutStylePartial(node),
    ...getCornerStylePartial(node),
    ...(await getFillBorderStylePartial(node)),
  };
}

export async function getTextStyle(
  node: TextNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Partial<StyleJSON>> {
  return {
    ...getPositionStylePartial(node, parentLayout, [offset[0], offset[1]]),
    ...(await getTextStylePartial(node)),
  };
}

export async function getImageStyle(
  node: RectangleNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<Partial<StyleJSON>> {
  const image = figma.getImageByHash(node.fills[0].imageHash);

  const hash = getURLSafeBase64Hash(data);
  const dataURL = imageToDataURL(data);
  // TODO: add image to assets

  return {
    ...getPositionStylePartial(node, parentLayout, [offset[0], offset[1]]),
    ...getCornerStylePartial(node),
    ...(await getFillBorderStylePartial(node)),
  };
}
