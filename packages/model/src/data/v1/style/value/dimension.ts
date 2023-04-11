import { z } from "zod";

export const PxValue = z.number();
export const PxPercentValue = z.union([
  z.number(),
  z.tuple([z.number(), z.literal("%")]),
]);
