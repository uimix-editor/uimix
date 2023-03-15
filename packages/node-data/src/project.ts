import { z } from "zod";
import { NodeJSON } from "./node/node.js";
import { StyleJSON } from "./style/style.js";

export const ProjectJSON = z.object({
  // TODO: version
  nodes: z.record(NodeJSON),
  styles: z.record(StyleJSON.partial()),
  componentURLs: z.array(z.string()).optional(),
  images: z.record(z.string()).optional(),
});

export type ProjectJSON = z.infer<typeof ProjectJSON>;
