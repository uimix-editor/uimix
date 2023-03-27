import { z } from "zod";

// TODO: reference to color tokens

export const Color = z.string();
export type Color = z.infer<typeof Color>;
