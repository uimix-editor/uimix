import {
  reactComponent,
  Component,
  DesignTokens,
  PropType,
} from "@uimix/adapter-react";
import { Button } from "./stories/Button";
import { Header } from "./stories/Header";
import designTokens from "./designTokens";
import MUIButton from "@mui/material/Button";

export const components: Component[] = [
  // local components
  reactComponent({
    path: "/src/stories/Button.tsx",
    name: "Button",
    component: Button,
    props: PropType.object({
      primary: PropType.boolean(),
      backgroundColor: PropType.string(),
      label: PropType.string(),
      size: PropType.enum(["small", "medium", "large"]),
    }),
  }),
  reactComponent({
    path: "/src/stories/Header.tsx",
    name: "Header",
    component: Header,
  }),
  // external components
  reactComponent({
    path: "@mui/material/Button",
    component: MUIButton,
    props: PropType.object({
      children: PropType.string(),
      variant: PropType.enum(["text", "outlined", "contained"]),
    }),
  }),
];

export const tokens: DesignTokens = designTokens;
