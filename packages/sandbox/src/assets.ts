import { Button } from "./stories/Button";

export const components = [
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
];
