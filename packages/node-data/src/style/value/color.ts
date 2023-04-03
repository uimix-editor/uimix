import { z } from "zod";

export const ColorTokenReference = z.object({
  type: z.literal("token"),
  id: z.string(),
});

export const Color = z.union([ColorTokenReference, z.string()]);
export type Color = z.infer<typeof Color>;
