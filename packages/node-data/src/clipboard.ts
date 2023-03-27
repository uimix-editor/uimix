import { z } from "zod";
import { NodeJSON } from "./node/node";
import { Image } from "./project";
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

export const NodeClipboardData = z.object({
  uimixClipboardVersion: z.literal("0.0.1"),
  type: z.literal("nodes"),
  nodes: z.array(NodeHierarchy),
  images: z.record(Image), // URLs must be data URLs
});

export type NodeClipboardData = z.infer<typeof NodeClipboardData>;
