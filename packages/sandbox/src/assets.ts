import { Button } from "./stories/Button";
import {
  reactComponent,
  Component,
  DesignTokens,
  PropType,
} from "@uimix/adapter-react";

export const components: Component[] = [
  // local components
  reactComponent({
    path: "/src/stories/Button",
    name: "Button",
    component: Button,
    props: PropType.object({
      label: PropType.string(),
      size: PropType.enum_(["small", "medium", "large"]),
    }),
  }),
  // external components
  reactComponent({
    path: "@mui/material/Button",
    component: (await import("@mui/material/Button")).default,
    props: PropType.object({
      // TODO
    }),
  }),
];

export const tokens: DesignTokens = {
  // TODO
};
