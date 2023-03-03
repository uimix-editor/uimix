import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

export function formatJSON(text: string): string {
  return prettier.format(text, {
    parser: "json",
    plugins: [parserBabel],
  });
}
