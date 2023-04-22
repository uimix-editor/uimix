import { z } from "zod";

export const ImageType = z.enum(["image/png", "image/jpeg"]);
export type ImageType = z.infer<typeof ImageType>;

export const Image = z.object({
  hash: z.string(), // URL-safe base64 of the sha256 hash of the image data
  width: z.number(),
  height: z.number(),
  type: ImageType,
  url: z.string(),
});

export type Image = z.infer<typeof Image>;
