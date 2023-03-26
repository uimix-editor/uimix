import { z } from "zod";
import { PxValue } from "./dimension";

export const Shadow = z.object({
  hex: z.string(),
  x: PxValue,
  y: PxValue,
  blur: PxValue,
  spread: PxValue,
});

export type Shadow = z.infer<typeof Shadow>;
