import {
  reactComponent,
  Component,
  DesignTokens,
  PropType,
} from "@uimix/adapter-react";
import { Button } from "./stories/Button";
import { Header } from "./stories/Header";
import designTokens from "./designTokens";

export const components: Component[] = [
  // local components
  reactComponent({
    path: "/src/stories/Button",
    name: "Button",
    component: Button,
    props: PropType.object({
      primary: PropType.boolean(),
      backgroundColor: PropType.string(),
      label: PropType.string(),
      size: PropType.enum_(["small", "medium", "large"]),
    }),
  }),
  reactComponent({
    path: "/src/stories/Header",
    name: "Header",
    component: Header,
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

export const tokens: DesignTokens = designTokens;
