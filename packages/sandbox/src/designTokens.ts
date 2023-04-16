import colors from "tailwindcss/colors";

type DefaultColors = typeof colors;

interface ColorToken {
  $value: string;
  $type: "color";
}

type DesignToken = ColorToken;

interface DesignTokens {
  [key: string]: DesignToken | DesignTokens;
}

function colorsToDesignTokens(colors: DefaultColors): DesignTokens {
  const designTokens: DesignTokens = {};

  for (const [colorName, colorValue] of Object.entries(colors)) {
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
