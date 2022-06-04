import prettier from "prettier/standalone";
import parserHTML from "prettier/parser-html";
import parserPostCSS from "prettier/parser-postcss";

export function formatHTML(
  html: string,
  options: {
    printWidth?: number;
  } = {}
): string {
  return prettier.format(html, {
    parser: "html",
    plugins: [parserHTML, parserPostCSS],
    ...options,
  });
}
