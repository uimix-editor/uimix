import { z } from "zod";

export const SolidFill = z.object({
  type: z.literal("solid"),
  hex: z.string(),
});

export type SolidFill = z.infer<typeof SolidFill>;
