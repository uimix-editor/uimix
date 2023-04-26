import { ReactNode, useId } from "react";
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

const Color = z.string();
type Color = z.infer<typeof Color>;

const Fill = z.object({
  solid: Color,
});
type Fill = z.infer<typeof Fill>;

function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export const Box: React.FC<
  Partial<StyleProps> & {
    children?: ReactNode;
  }
> = (props) => {
  const style = buildNodeCSS("frame", {
    ...defaultStyle,
    ...props,
  });

  const id = useId();
  const className = `box-${id}`;

  const cssBody = Object.entries(style.self)
    .map(([key, value]) => {
      return `${kebabCase(key)}: ${String(value)};`;
    })
    .join(";");
  const childrenCSSBody = Object.entries(style.children)
    .map(([key, value]) => {
      return `${kebabCase(key)}: ${String(value)};`;
    })
    .join(";");

  const styleText = `.${className}{${cssBody}} .${className}>*{${childrenCSSBody}}`;

  return (
    <div className={className}>
      <style>{styleText}</style>
      {props.children}
    </div>
  );
};

interface StyleProps {
  hidden: boolean;
  position: Position | null;
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

export const defaultStyle: StyleProps = {
  hidden: false,
  position: null,
  width: "hug",
  height: "hug",

  topLeftRadius: 0,
  topRightRadius: 0,
  bottomRightRadius: 0,
  bottomLeftRadius: 0,

  fills: [],
  border: null,
  borderTopWidth: 0,
  borderRightWidth: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 0,

  opacity: 1,
  overflowHidden: false,

  shadows: [],

  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,

  // stack (auto layout)

  layout: "none",
  flexDirection: "x",
  flexAlign: "start",
  flexJustify: "start",
  gridColumnCount: null,
  gridRowCount: null,
  rowGap: 0,
  columnGap: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,

  // text

  textContent: "",
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: null,
  letterSpacing: 0,
  textHorizontalAlign: "start",
  textVerticalAlign: "start",

  image: null,

  tagName: null,
};

const xFlexGrowVarName = "--uimix-x-flex-grow";
const yFlexGrowVarName = "--uimix-y-flex-grow";
const xHeightVarName = "--uimix-x-height";
const yWidthVarName = "--uimix-y-width";
const gridWidthVarName = "--uimix-grid-width";
const gridHeightVarName = "--uimix-grid-height";

type PropertiesWithVars = CSS.Properties & {
  [xFlexGrowVarName]?: number;
  [yFlexGrowVarName]?: number;
  [xHeightVarName]?: CSS.Properties["height"];
  [yWidthVarName]?: CSS.Properties["width"];
  [gridWidthVarName]?: CSS.Properties["width"];
  [gridHeightVarName]?: CSS.Properties["height"];
};

export interface SelfAndChildrenCSS {
  self: PropertiesWithVars;
  children: CSS.Properties;
}

export function buildNodeCSS(
  nodeType: "frame" | "text" | "image" | "svg",
  style: StyleProps
): SelfAndChildrenCSS {
  const cssStyle: PropertiesWithVars = {};
  const childrenStyle: CSS.Properties = {};

  const position = style.position;
  if (position) {
    cssStyle.position = "absolute";
    if (position) {
      cssStyle.top =
        position.top !== undefined ? `${position.top}px` : undefined;
      cssStyle.right =
        position.right !== undefined ? `${position.right}px` : undefined;
      cssStyle.bottom =
        position.bottom !== undefined ? `${position.bottom}px` : undefined;
      cssStyle.left =
        position.left !== undefined ? `${position.left}px` : undefined;
    }
  } else {
    cssStyle.position = "relative";
  }

  cssStyle.marginTop = `${style.marginTop}px`;
  cssStyle.marginRight = `${style.marginRight}px`;
  cssStyle.marginBottom = `${style.marginBottom}px`;
  cssStyle.marginLeft = `${style.marginLeft}px`;

  // TODO: unset width/height when both left/right or top/bottom are set

  const width = style.width;
  if (typeof width === "object") {
    // polyfill width:stretch
    cssStyle[xFlexGrowVarName] = 1;
    cssStyle[yWidthVarName] = cssStyle[gridWidthVarName] = `calc(100% - ${
      style.marginLeft + style.marginRight
    }px)`;
    cssStyle.minWidth = width.min !== undefined ? `${width.min}px` : undefined;
    cssStyle.maxWidth = width.max !== undefined ? `${width.max}px` : undefined;
  } else {
    let cssWidth: string;
    if (width === "hug") {
      cssWidth = "max-content";
    } else {
      cssWidth = `${width}px`;
    }

    cssStyle[xFlexGrowVarName] = 0;
    cssStyle[yWidthVarName] =
      cssStyle[gridWidthVarName] =
      cssStyle.width =
        cssWidth;
  }

  const height = style.height;
  if (typeof height === "object") {
    // polyfill height:stretch
    cssStyle[yFlexGrowVarName] = 1;
    cssStyle[xHeightVarName] = cssStyle[gridHeightVarName] = `calc(100% - ${
      style.marginTop + style.marginBottom
    }px)`;
    cssStyle.minHeight =
      height.min !== undefined ? `${height.min}px` : undefined;
    cssStyle.maxHeight =
      height.max !== undefined ? `${height.max}px` : undefined;
  } else {
    let cssHeight: string;
    if (height === "hug") {
      cssHeight = "max-content";
    } else {
      cssHeight = `${height}px`;
    }

    cssStyle[yFlexGrowVarName] = 0;
    cssStyle[xHeightVarName] =
      cssStyle[gridHeightVarName] =
      cssStyle.height =
        cssHeight;
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

      if (style.flexDirection === "x") {
        childrenStyle.flexGrow = `var(${xFlexGrowVarName})`;
        childrenStyle.height = `var(${xHeightVarName})`;
      } else {
        childrenStyle.flexGrow = `var(${yFlexGrowVarName})`;
        childrenStyle.width = `var(${yWidthVarName})`;
      }
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

      childrenStyle.width = `var(${gridWidthVarName})`;
      childrenStyle.height = `var(${gridHeightVarName})`;
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
    cssStyle.background = fills.length ? fills[0].solid : "transparent";
    cssStyle.borderStyle = "solid";
    cssStyle.borderColor =
      (style.border && style.border.solid) ?? "transparent";
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
    cssStyle.color = fills.length ? fills[0].solid : "transparent";
    cssStyle.fontFamily = style.fontFamily;
    cssStyle.fontSize = `${style.fontSize}px`;
    cssStyle.fontWeight = style.fontWeight;
    const lineHeight = style.lineHeight;
    cssStyle.lineHeight =
      typeof lineHeight === "number" ? `${lineHeight}px` : lineHeight ?? "auto";
    const letterSpacing = style.letterSpacing;
    cssStyle.letterSpacing =
      typeof letterSpacing === "number" ? `${letterSpacing}px` : letterSpacing;
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

  return { self: cssStyle, children: childrenStyle };
}
