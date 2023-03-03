import { z } from "zod";

export const PositionConstraint = z.union([
  z.object({
    type: z.literal("start"),
    start: z.number(),
  }),
  z.object({
    type: z.literal("center"),
    offset: z.number(),
  }),
  z.object({
    type: z.literal("end"),
    end: z.number(),
  }),
  z.object({
    type: z.literal("both"),
    start: z.number(),
    end: z.number(),
  }),
  z.object({
    type: z.literal("scale"),
    startRatio: z.number(),
    sizeRatio: z.number(),
  }),
]);
export type PositionConstraint = z.infer<typeof PositionConstraint>;

export const PositionConstraints = z.object({
  x: PositionConstraint,
  y: PositionConstraint,
});
export type PositionConstraints = z.infer<typeof PositionConstraints>;

export type PositionConstraintType = PositionConstraint["type"];
