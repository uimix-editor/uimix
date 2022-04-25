import prettier from "prettier/standalone";
import parserHTML from "prettier/parser-html";

export function formatHTML(html: string): string {
  return prettier.format(html, {
    parser: "html",
    plugins: [parserHTML],
  });
}
