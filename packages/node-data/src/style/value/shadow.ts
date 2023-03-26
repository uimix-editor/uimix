import { z } from "zod";

export const Shadow = z.object({
  color: z.string(),
  x: z.number(),
  y: z.number(),
  blur: z.number(),
  spread: z.number(),
});

export type Shadow = z.infer<typeof Shadow>;
