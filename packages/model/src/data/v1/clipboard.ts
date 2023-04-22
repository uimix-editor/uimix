import { z } from "zod";
import { NodeType, VariantCondition } from "./node";
import { Image } from "./image";
import { Style } from "./style";

const SelectableBase = z.object({
  id: z.string(),
  type: NodeType,
  name: z.string().optional(),
  original: z
    .object({
      id: z.string(),
      type: NodeType,
      condition: VariantCondition.optional(),
    })
    .optional(),
  style: Style.partial(),
  selfStyle: Style.partial().optional(),
});

export type Selectable = z.infer<typeof SelectableBase> & {
  children: Selectable[];
};

export const Selectable: z.ZodType<Selectable> = SelectableBase.extend({
  children: z.lazy(() => z.array(Selectable)),
});

export const NodeClipboard = z.object({
  uimixClipboardVersion: z.literal("0.0.1"),
  type: z.literal("nodes"),
  nodes: z.array(Selectable),
  images: z.record(Image), // URLs must be data URLs
});

export type NodeClipboard = z.infer<typeof NodeClipboard>;
