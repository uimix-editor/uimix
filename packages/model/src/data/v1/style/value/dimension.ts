import { z } from "zod";

export const PxValue = z.number();
export type PxValue = z.infer<typeof PxValue>;

export const PxPercentValue = z.union([
  z.number(),
  z.tuple([z.number(), z.literal("%")]),
]);
export type PxPercentValue = z.infer<typeof PxPercentValue>;
