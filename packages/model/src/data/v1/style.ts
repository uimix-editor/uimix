import { z } from "zod";

// dimension values

export const PxValue = z.number();
export type PxValue = z.infer<typeof PxValue>;

export const PxPercentValue = z.union([
  z.number(),
  z.tuple([z.number(), z.literal("%")]),
]);
export type PxPercentValue = z.infer<typeof PxPercentValue>;

export const PositionConstraint = z.union([
  z.object({
    type: z.literal("start"),
    start: PxValue,
  }),
  z.object({
    type: z.literal("end"),
    end: PxValue,
  }),
  z.object({
    type: z.literal("both"),
    start: PxValue,
    end: PxValue,
  }),
  // z.object({
  //   type: z.literal("center"),
  //   center: PxValue,
  // }),
  // z.object({
  //   type: z.literal("scale"),
  //   startRatio: z.number(),
  //   sizeRatio: z.number(),
  // }),
]);
export type PositionConstraint = z.infer<typeof PositionConstraint>;

export const PositionConstraints = z.object({
  x: PositionConstraint,
  y: PositionConstraint,
});
export type PositionConstraints = z.infer<typeof PositionConstraints>;

export type PositionConstraintType = PositionConstraint["type"];

export const SizeConstraint = z.union([
  z.object({
    type: z.literal("hug"),
  }),
  z.object({
    type: z.literal("fixed"),
    value: PxValue,
  }),
  z.object({
    type: z.literal("fill"),
    min: PxValue.optional(),
    max: PxValue.optional(),
    /**
     * Default size when the layer is not in a layout.
     */
    value: PxValue.optional(),
  }),
]);

export type SizeConstraint = z.infer<typeof SizeConstraint>;

export type SizeConstraintType = SizeConstraint["type"];

// color values

export const ColorTokenReference = z.object({
  type: z.literal("token"),
  id: z.string(),
});

export const Color = z.union([ColorTokenReference, z.string()]);
export type Color = z.infer<typeof Color>;

export const SolidFill = z.object({
  type: z.literal("solid"),
  color: Color,
});

export type SolidFill = z.infer<typeof SolidFill>;

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
  position: z.union([
    z.null(),
    z.object({
      x: PositionConstraint,
      y: PositionConstraint,
    }),
  ]),
  preferAbsolute: z.boolean(),
  width: SizeConstraint,
  height: SizeConstraint,

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
  lineHeight: z.union([PxPercentValue, z.null()]), // percent means relative to font size (null for auto)
  letterSpacing: PxPercentValue, // percent means relative to font size
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
