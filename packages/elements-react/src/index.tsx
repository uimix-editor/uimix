import { ReactNode } from "react";
import { z } from "zod";
import * as CSS from "csstype";

const Shadow = z.object({
  color: z.string(),
  x: z.number(),
  y: z.number(),
  blur: z.number(),
  spread: z.number(),
});

type Shadow = z.infer<typeof Shadow>;

const StackDirection = z.enum(["x", "y"]);
type StackDirection = z.infer<typeof StackDirection>;

const StackAlign = z.enum(["start", "center", "end"]);
type StackAlign = z.infer<typeof StackAlign>;

const StackJustify = z.enum(["start", "center", "end", "spaceBetween"]);
type StackJustify = z.infer<typeof StackJustify>;

const TextHorizontalAlign = z.enum(["start", "center", "end", "justify"]);
type TextHorizontalAlign = z.infer<typeof TextHorizontalAlign>;

const TextVerticalAlign = z.enum(["start", "center", "end"]);
type TextVerticalAlign = z.infer<typeof TextVerticalAlign>;

const Position = z.object({
  left: z.number().optional(),
  top: z.number().optional(),
  right: z.number().optional(),
  bottom: z.number().optional(),
});
type Position = z.infer<typeof Position>;

const Size = z.union([
  z.literal("hug"),
  z.number(),
  z.object({
    min: z.number(),
    max: z.number().optional(),
  }),
]);
type Size = z.infer<typeof Size>;

const Color = z.union([
  z.string(), // hex
  z.object({
    token: z.string(),
  }),
]);
type Color = z.infer<typeof Color>;

const Fill = z.object({
  solid: Color,
});
type Fill = z.infer<typeof Fill>;

export const Box: React.FC<
  Partial<StyleProps> & {
    children?: ReactNode;
  }
> = (props) => {
  return <div>{props.children}</div>;
};

interface StyleProps {
  hidden: boolean;
  position: Position;
  absolute: boolean;
  width: Size;
  height: Size;
  topLeftRadius: number;
  topRightRadius: number;
  bottomRightRadius: number;
  bottomLeftRadius: number;
  fills: Fill[];
  border: Fill | null;
  borderTopWidth: number;
  borderRightWidth: number;
  borderBottomWidth: number;
  borderLeftWidth: number;
  opacity: number;
  overflowHidden: boolean;
  shadows: Shadow[];

  // only for non-absolute layers
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;

  // layout
  layout: "none" | "flex" | "grid";
  flexDirection: StackDirection;
  flexAlign: StackAlign;
  flexJustify: StackJustify;
  gridRowCount: number | null;
  gridColumnCount: number | null;
  rowGap: number;
  columnGap: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;

  // text
  textContent: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number | string | null; // percent means relative to font size (null for auto)
  letterSpacing: number | string; // percent means relative to font size: ;
  textHorizontalAlign: TextHorizontalAlign;
  textVerticalAlign: TextVerticalAlign;

  // image URL
  image: string | null;

  // tag name
  tagName: string | null;
}

export function buildNodeCSS(
  nodeType: "frame" | "text" | "image" | "svg",
  style: StyleProps
): CSS.Properties {
  const cssStyle: CSS.Properties = {};

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

  return cssStyle;
}
