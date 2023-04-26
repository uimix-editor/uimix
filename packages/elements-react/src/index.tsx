import { ReactNode } from "react";
import { z } from "zod";

export const Shadow = z.object({
  color: z.string(),
  x: z.number(),
  y: z.number(),
  blur: z.number(),
  spread: z.number(),
});

export type Shadow = z.infer<typeof Shadow>;

export const StackDirection = z.enum(["x", "y"]);
export type StackDirection = z.infer<typeof StackDirection>;

export const StackAlign = z.enum(["start", "center", "end"]);
export type StackAlign = z.infer<typeof StackAlign>;

export const StackJustify = z.enum(["start", "center", "end", "spaceBetween"]);
export type StackJustify = z.infer<typeof StackJustify>;

export const TextHorizontalAlign = z.enum([
  "start",
  "center",
  "end",
  "justify",
]);
export type TextHorizontalAlign = z.infer<typeof TextHorizontalAlign>;

export const TextVerticalAlign = z.enum(["start", "center", "end"]);
export type TextVerticalAlign = z.infer<typeof TextVerticalAlign>;

export const Position = z.object({
  left: z.number().optional(),
  top: z.number().optional(),
  right: z.number().optional(),
  bottom: z.number().optional(),
});
export type Position = z.infer<typeof Position>;

export const Size = z.union([
  z.literal("hug"),
  z.number(),
  z.object({
    min: z.number(),
    max: z.number().optional(),
  }),
]);
export type Size = z.infer<typeof Size>;

export const Color = z.union([
  z.string(), // hex
  z.object({
    token: z.string(),
  }),
]);
export type Color = z.infer<typeof Color>;

export const Fill = z.object({
  solid: Color,
});
export type Fill = z.infer<typeof Fill>;

export const BaseStyleProps = z.object({
  hidden: z.boolean(),
  locked: z.boolean(),
  position: Position,
  absolute: z.boolean(),
  width: Size,
  height: Size,

  topLeftRadius: z.number(),
  topRightRadius: z.number(),
  bottomRightRadius: z.number(),
  bottomLeftRadius: z.number(),

  fills: z.array(Fill),
  border: z.union([Fill, z.null()]),
  borderTopWidth: z.number(),
  borderRightWidth: z.number(),
  borderBottomWidth: z.number(),
  borderLeftWidth: z.number(),

  opacity: z.number(),
  overflowHidden: z.boolean(),

  shadows: z.array(Shadow),

  // only for non-absolute layers
  marginTop: z.number(),
  marginRight: z.number(),
  marginBottom: z.number(),
  marginLeft: z.number(),

  // layout

  layout: z.enum(["none", "flex", "grid"]),
  flexDirection: StackDirection,
  flexAlign: StackAlign,
  flexJustify: StackJustify,
  gridRowCount: z.union([z.number(), z.null()]),
  gridColumnCount: z.union([z.number(), z.null()]),
  rowGap: z.number(),
  columnGap: z.number(),
  paddingTop: z.number(),
  paddingRight: z.number(),
  paddingBottom: z.number(),
  paddingLeft: z.number(),

  // text

  textContent: z.string(),
  fontFamily: z.string(),
  fontWeight: z.number(),
  fontSize: z.number(),
  lineHeight: z.union([z.number(), z.string(), z.null()]), // percent means relative to font size (null for auto)
  letterSpacing: z.union([z.number(), z.string()]), // percent means relative to font size: ;
  textHorizontalAlign: TextHorizontalAlign,
  textVerticalAlign: TextVerticalAlign,

  // image
  image: z.union([z.string(), z.null()]),

  // svg
  svg: z.string(),

  // instance
  component: z.union([z.string(), z.null()]),

  // foreign
  componentType: z.literal("react"),
  props: z.record(z.unknown()),

  // tag name
  tagName: z.union([z.string(), z.null()]),
});
export type BaseStyleProps = z.infer<typeof BaseStyleProps>;

export const Box: React.FC<
  Partial<BaseStyleProps> & {
    children?: ReactNode;
  }
> = (props) => {
  return <div>{props.children}</div>;
};
