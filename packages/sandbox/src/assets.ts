import {
  reactComponent,
  Component,
  DesignTokens,
  PropType,
} from "@uimix/adapter-react";
import { Button } from "./stories/Button";
import { Header } from "./stories/Header";
import { ThrowingComponent } from "./stories/ThrowingComponent";
import MUIButton from "@mui/material/Button";
import tailwindColors from "tailwindcss/colors";

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
  reactComponent({
    path: "/src/stories/ThrowingComponent.tsx",
    name: "ThrowingComponent",
    component: ThrowingComponent,
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

function tailwindColorsToTokens(colors: typeof tailwindColors): DesignTokens {
  const designTokens: DesignTokens = {};

  for (const [colorName, colorValue] of Object.entries(colors)) {
    if (/[A-Z]/.test(colorName)) {
      // Skip deprecated colors
      continue;
    }

    if (typeof colorValue === "string") {
      designTokens[colorName] = {
        $value: colorValue,
        $type: "color",
      };
    } else {
      designTokens[colorName] = tailwindColorsToTokens(
        colorValue as typeof tailwindColors
      );
    }
  }

  return designTokens;
}

export const tokens: DesignTokens = tailwindColorsToTokens(tailwindColors);
