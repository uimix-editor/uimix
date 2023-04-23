import { Button } from "./stories/Button";
import { reactComponent, Component, DesignTokens } from "@uimix/adapter-react";

export const components: Component[] = [
  // local components
  reactComponent({
    path: "/src/stories/Button",
    name: "Button",
    component: Button,
    // TODO; type-check props based on Button parameters
    props: {
      label: { type: "string" },
      size: { type: "enum", options: ["small", "medium", "large"] },
    },
  }),
  // external components
  reactComponent({
    path: "@mui/material/Button",
    component: (await import("@mui/material/Button")).default,
    props: {
      // TODO
    },
  }),
];

export const tokens: DesignTokens = {
  // TODO
};
