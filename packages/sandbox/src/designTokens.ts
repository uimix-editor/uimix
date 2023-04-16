import { DesignToken } from "@uimix/code-asset-types";
import colors from "tailwindcss/colors";

function flattenColors(
  colors: Record<string, string | Record<string, string>>
): { name: string; value: string }[] {
  const result: { name: string; value: string }[] = [];

  for (const [name, value] of Object.entries(colors)) {
    if (typeof value === "string") {
      result.push({ name, value });
    } else {
      result.push(
        ...flattenColors(value).map((v) => ({
          name: `${name}/${v.name}`,
          value: v.value,
        }))
      );
    }
  }

  return result;
}

// TODO: support W3C design tokens?
const tokens: DesignToken[] = [
  // {
  //   type: "color",
  //   id: "@uimix/sandbox/accent",
  //   name: "Accent",
  //   value: "#1ea7fd",
  // },
  // {
  //   type: "color",
  //   id: "@uimix/sandbox/text",
  //   name: "Text",
  //   value: "#333333",
  // },
  ...flattenColors(colors).map(({ name, value }) => ({
    type: "color",
    id: name,
    name,
    value,
  })),
];

export default tokens;
