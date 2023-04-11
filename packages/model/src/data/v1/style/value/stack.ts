import { z } from "zod";

export const StackDirection = z.enum(["x", "y"]);
export type StackDirection = z.infer<typeof StackDirection>;

export const StackAlign = z.enum(["start", "center", "end"]);
export type StackAlign = z.infer<typeof StackAlign>;

export const StackJustify = z.enum(["start", "center", "end", "spaceBetween"]);
export type StackJustify = z.infer<typeof StackJustify>;
