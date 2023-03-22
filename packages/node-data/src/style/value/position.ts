import { z } from "zod";
import { PxValue } from "./dimension";

export const PositionConstraint = z.union([
  z.object({
    type: z.literal("start"),
    start: PxValue,
  }),
  z.object({
    type: z.literal("center"),
    offset: PxValue,
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
