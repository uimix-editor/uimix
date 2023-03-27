import { z } from "zod";
import { Color } from "./color";
import { PxValue } from "./dimension";

export const Shadow = z.object({
  color: Color,
  x: PxValue,
  y: PxValue,
  blur: PxValue,
  spread: PxValue,
});

export type Shadow = z.infer<typeof Shadow>;
