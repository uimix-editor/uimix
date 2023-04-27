import { z } from "zod";

// dimension values

export const PxValue = z.number();
export type PxValue = z.infer<typeof PxValue>;

export const PercentString = z.custom<`${number}%`>((val) => {
  try {
    if (typeof val !== "string") {
      return false;
    }
    if (!val.endsWith("%")) {
      return false;
    }
    return typeof JSON.parse(val.slice(0, -1)) === "number";
  } catch {
    return false;
  }
});
export type PercentString = z.infer<typeof PercentString>;

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
    default: z.number().optional(),
  }),
]);
export type Size = z.infer<typeof Size>;

// color values

export const ColorTokenReference = z.object({
  token: z.string(),
});
export type ColorTokenReference = z.infer<typeof ColorTokenReference>;

export const Color = z.union([
  z.string(), // TODO: validate hex
  ColorTokenReference,
]);
export type Color = z.infer<typeof Color>;

export const SolidFill = z.object({
  solid: Color,
});
export type SolidFill = z.infer<typeof SolidFill>;

export const Fill = SolidFill;
export type Fill = z.infer<typeof Fill>;

export const Shadow = z.object({
  color: Color,
  x: PxValue,
  y: PxValue,
  blur: PxValue,
  spread: PxValue,
});

export type Shadow = z.infer<typeof Shadow>;

// stack values

export const StackDirection = z.enum(["x", "y"]);
export type StackDirection = z.infer<typeof StackDirection>;

export const StackAlign = z.enum(["start", "center", "end"]);
export type StackAlign = z.infer<typeof StackAlign>;

export const StackJustify = z.enum(["start", "center", "end", "spaceBetween"]);
export type StackJustify = z.infer<typeof StackJustify>;

// text values

export const TextHorizontalAlign = z.enum([
  "start",
  "center",
  "end",
  "justify",
]);
export type TextHorizontalAlign = z.infer<typeof TextHorizontalAlign>;

export const TextVerticalAlign = z.enum(["start", "center", "end"]);
export type TextVerticalAlign = z.infer<typeof TextVerticalAlign>;

// component values

export const ForeignComponentRef = z.object({
  type: z.literal("react"),
  path: z.string(),
  name: z.string(),
  props: z.record(z.unknown()),
});

export type ForeignComponentRef = z.infer<typeof ForeignComponentRef>;

export const Style = z.object({
  hidden: z.boolean(),
  locked: z.boolean(),
  position: z.union([z.null(), Position]),
  preferAbsolute: z.boolean(),
  width: Size,
  height: Size,

  topLeftRadius: PxValue,
  topRightRadius: PxValue,
  bottomRightRadius: PxValue,
  bottomLeftRadius: PxValue,

  fills: z.array(SolidFill),
  border: z.union([SolidFill, z.null()]),
  borderTopWidth: PxValue,
  borderRightWidth: PxValue,
  borderBottomWidth: PxValue,
  borderLeftWidth: PxValue,

  opacity: z.number(),
  overflowHidden: z.boolean(),

  shadows: z.array(Shadow),

  // only for non-absolute layers
  marginTop: PxValue,
  marginRight: PxValue,
  marginBottom: PxValue,
  marginLeft: PxValue,

  // layout

  layout: z.enum(["none", "flex", "grid"]),
  flexDirection: StackDirection,
  flexAlign: StackAlign,
  flexJustify: StackJustify,
  gridRowCount: z.union([z.number(), z.null()]),
  gridColumnCount: z.union([z.number(), z.null()]),
  rowGap: PxValue,
  columnGap: PxValue,
  paddingTop: PxValue,
  paddingRight: PxValue,
  paddingBottom: PxValue,
  paddingLeft: PxValue,

  // text

  textContent: z.string(),
  fontFamily: z.string(),
  fontWeight: z.number(),
  fontSize: PxValue,
  lineHeight: z.union([z.number(), PercentString, z.null()]), // percent means relative to font size (null for auto)
  letterSpacing: z.union([z.number(), PercentString]), // percent means relative to font size: ;
  textHorizontalAlign: TextHorizontalAlign,
  textVerticalAlign: TextVerticalAlign,

  // image
  imageHash: z.union([z.string(), z.null()]),

  // svg
  svgContent: z.string(),

  // instance
  mainComponent: z.union([z.string(), z.null()]),

  // foreign
  foreignComponent: z.union([ForeignComponentRef, z.null()]),

  // tag name
  tagName: z.union([z.string(), z.null()]),
});

export type Style = z.infer<typeof Style>;
