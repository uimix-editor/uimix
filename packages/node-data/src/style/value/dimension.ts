import { z } from "zod";

export const PxValue = z.tuple([z.number(), z.literal("px")]);
export const PxPercentValue = z.tuple([
  z.number(),
  z.union([z.literal("px"), z.literal("%")]),
]);
