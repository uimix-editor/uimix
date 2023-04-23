import { Button } from "./stories/Button";

export const components = [
  // local components
  {
    type: "react",
    path: "/src/stories/Button",
    component: Button,
    // TODO; type-check props based on Button parameters
    props: {
      label: { type: "string" },
      size: { type: "enum", options: ["small", "medium", "large"] },
    },
  },
  // external components
  {
    type: "react",
    path: "@mui/material/Button",
    component: await import("@mui/material/Button"),
    props: {
      // TODO
    },
  },
];

export const tokens = [
  // TODO
];
