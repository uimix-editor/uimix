import { z } from "zod";
import { NodeJSON } from "./node/node";
import { Image, ProjectJSON } from "./project";
import { StyleJSON } from "./style/style";

const NodeHierarchyBase = NodeJSON.omit({
  index: true,
  parent: true,
}).extend({
  id: z.string(),
  style: StyleJSON.partial(),
});

export type NodeHierarchy = z.infer<typeof NodeHierarchyBase> & {
  children: NodeHierarchy[];
};

export const NodeHierarchy: z.ZodType<NodeHierarchy> = NodeHierarchyBase.extend(
  {
    children: z.lazy(() => z.array(NodeHierarchy)),
  }
);

export const JSONClipboardData = z.object({
  uimixClipboardVersion: z.literal("0.0.1"),
  nodes: z.array(NodeHierarchy),
  images: z.record(Image), // URLs must be data URLs
});

export type JSONClipboardData = z.infer<typeof JSONClipboardData>;
