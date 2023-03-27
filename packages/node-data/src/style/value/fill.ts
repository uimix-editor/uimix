import { z } from "zod";
import { Color } from "./color";

export const SolidFill = z.object({
  type: z.literal("solid"),
  color: Color,
});

export type SolidFill = z.infer<typeof SolidFill>;
