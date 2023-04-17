import { DesignTokens } from "@uimix/code-asset-types";
import colors from "tailwindcss/colors";

type DefaultColors = typeof colors;

function colorsToDesignTokens(colors: DefaultColors): DesignTokens {
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
      designTokens[colorName] = colorsToDesignTokens(
        colorValue as DefaultColors
      );
    }
  }

  return designTokens;
}

const tokens = colorsToDesignTokens(colors);

export default tokens;
