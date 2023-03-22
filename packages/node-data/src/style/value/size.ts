import { z } from "zod";
import { PxValue } from "./dimension";

export const SizeConstraint = z.union([
  z.object({
    type: z.literal("hugContents"),
  }),
  z.object({
    type: z.literal("fixed"),
    value: PxValue,
  }),
  z.object({
    type: z.literal("fillContainer"),
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
