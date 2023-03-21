import { z } from "zod";
import { ProjectJSON } from "./project";

export const JSONClipboardData = z.object({
  uimixNodes: ProjectJSON,
});

export type JSONClipboardData = z.infer<typeof JSONClipboardData>;
