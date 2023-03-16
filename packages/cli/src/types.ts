import { z } from "zod";

export const ImageEntry = z.object({
  hash: z.string(),
  dataURL: z.string(),
});

export type ImageEntry = z.infer<typeof ImageEntry>;
