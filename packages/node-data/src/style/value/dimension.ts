import { z } from "zod";

export const PxValue = z
  .union([z.number(), z.tuple([z.number(), z.literal("px")])])
  .transform((value): [number, "px"] =>
    typeof value === "number" ? [value, "px"] : value
  );
export const PxPercentValue = z
  .union([
    z.number(),
    z.tuple([z.number(), z.union([z.literal("px"), z.literal("%")])]),
  ])
  .transform((value): [number, "px" | "%"] =>
    typeof value === "number" ? [value, "px"] : value
  );
