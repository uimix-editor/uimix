import { z } from "zod";

export const ForeignComponentRef = z.object({
  type: z.literal("react"),
  path: z.string(),
  name: z.string(),
  props: z.record(z.unknown()),
});

export type ForeignComponentRef = z.infer<typeof ForeignComponentRef>;
