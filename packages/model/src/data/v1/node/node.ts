import { z } from "zod";

export const NodeType = z.enum([
  "project",
  "page",
  "frame",
  "text",
  "image",
  "svg",
  "component",
  "variant",
  "instance",
  "foreign",
]);

export type NodeType = z.infer<typeof NodeType>;

export const VariantCondition = z.union([
  z.object({
    type: z.literal("hover"),
  }),
  z.object({
    type: z.literal("active"),
  }),
  z.object({
    type: z.literal("maxWidth"),
    value: z.number(),
  }),
]);

export type VariantCondition = z.infer<typeof VariantCondition>;

export const Node = z.object({
  type: NodeType,
  name: z.string().optional(),
  condition: VariantCondition.optional(),
  parent: z.string().optional(),
  index: z.number(),
});

export type Node = z.infer<typeof Node>;
