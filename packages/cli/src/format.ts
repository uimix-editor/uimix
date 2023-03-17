import prettier from "prettier/standalone.js";
import parserBabel from "prettier/parser-babel.js";
import parserTypeScript from "prettier/parser-typescript.js";
import parserPostCSS from "prettier/parser-postcss.js";

export function formatJSON(text: string): string {
  return prettier.format(text, {
    parser: "json",
    plugins: [parserBabel],
  });
}

export function formatTypeScript(text: string): string {
  return prettier.format(text, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });
}

export function formatCSS(text: string): string {
  return prettier.format(text, {
    parser: "css",
    plugins: [parserPostCSS],
  });
}
