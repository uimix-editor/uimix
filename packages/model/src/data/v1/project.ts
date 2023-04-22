import { z } from "zod";
import { Node } from "./node.js";
import { Style } from "./style.js";
import { Image } from "./image.js";

export const ColorToken = z.object({
  name: z.string(),
  value: z.string(),
  index: z.number(),
  page: z.string().optional(),
});
export type ColorToken = z.infer<typeof ColorToken>;

export const Project = z.object({
  // TODO: version
  nodes: z.record(Node),
  styles: z.record(Style.partial()),
  componentURLs: z.array(z.string()),
  images: z.record(Image),
  colors: z.record(ColorToken),
});

export type Project = z.infer<typeof Project>;
