import { z } from "zod";

export const TextHorizontalAlign = z.enum([
  "start",
  "center",
  "end",
  "justify",
]);
export type TextHorizontalAlign = z.infer<typeof TextHorizontalAlign>;

export const TextVerticalAlign = z.enum(["start", "center", "end"]);
export type TextVerticalAlign = z.infer<typeof TextVerticalAlign>;
