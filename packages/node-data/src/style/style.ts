import { z } from "zod";
import { PxPercentValue, PxValue } from "./value/dimension.js";
import { SolidFill } from "./value/fill.js";
import { ForeignComponentRef } from "./value/instance.js";
import { PositionConstraint } from "./value/position.js";
import { SizeConstraint } from "./value/size.js";
import { StackAlign, StackDirection, StackJustify } from "./value/stack.js";
import { TextHorizontalAlign, TextVerticalAlign } from "./value/text.js";

export const StyleJSON = z.object({
  hidden: z.boolean(),
  position: z.object({
    x: PositionConstraint,
    y: PositionConstraint,
  }),
  absolute: z.boolean(),
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

  // only for non-absolute layers
  marginTop: PxValue,
  marginRight: PxValue,
  marginBottom: PxValue,
  marginLeft: PxValue,

  // layout

  layout: z.enum(["none", "stack"]),
  stackDirection: StackDirection,
  stackAlign: StackAlign,
  stackJustify: StackJustify,
  gap: PxValue,
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

export type StyleJSON = z.infer<typeof StyleJSON>;
