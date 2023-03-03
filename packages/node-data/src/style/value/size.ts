import { z } from "zod";

export const SizeConstraint = z.union([
  z.object({
    type: z.literal("hugContents"),
  }),
  z.object({
    type: z.literal("fixed"),
    value: z.number(),
  }),
  z.object({
    type: z.literal("fillContainer"),
    min: z.number().optional(),
    max: z.number().optional(),
    /**
     * Default size when the layer is not in a layout.
     */
    value: z.number().optional(),
  }),
]);

export type SizeConstraint = z.infer<typeof SizeConstraint>;

export type SizeConstraintType = SizeConstraint["type"];
