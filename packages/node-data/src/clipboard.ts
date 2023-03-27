import { z } from "zod";
import { NodeType, VariantCondition } from "./node/node";
import { Image } from "./project";
import { StyleJSON } from "./style/style";

const SelectableJSONBase = z.object({
  id: z.string(),
  type: NodeType,
  name: z.string().optional(),
  condition: VariantCondition.optional(),
  style: StyleJSON.partial(),
});

export type SelectableJSON = z.infer<typeof SelectableJSONBase> & {
  children: SelectableJSON[];
};

export const SelectableJSON: z.ZodType<SelectableJSON> =
  SelectableJSONBase.extend({
    children: z.lazy(() => z.array(SelectableJSON)),
  });

export const NodeClipboardData = z.object({
  uimixClipboardVersion: z.literal("0.0.1"),
  type: z.literal("nodes"),
  nodes: z.array(SelectableJSON),
  images: z.record(Image), // URLs must be data URLs
});

export type NodeClipboardData = z.infer<typeof NodeClipboardData>;
