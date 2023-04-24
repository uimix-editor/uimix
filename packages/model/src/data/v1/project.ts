import { z } from "zod";
import { Node } from "./node.js";
import { Style } from "./style.js";

export const ColorToken = z.object({
  name: z.string(),
  value: z.string(),
  index: z.number(),
  page: z.string().optional(),
});
export type ColorToken = z.infer<typeof ColorToken>;

export const ImageType = z.enum(["image/png", "image/jpeg"]);
export type ImageType = z.infer<typeof ImageType>;

export const Image = z.object({
  width: z.number(),
  height: z.number(),
  type: ImageType,
  url: z.string(),
});

export type Image = z.infer<typeof Image>;

export const Project = z.object({
  // TODO: version
  nodes: z.record(Node),
  styles: z.record(Style.partial()),
  componentURLs: z.array(z.string()),
  images: z.record(Image),
  colors: z.record(ColorToken),
});

export type Project = z.infer<typeof Project>;
