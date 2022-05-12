import * as path from "path";
import slash from "slash";
import type * as hast from "hast";
// @ts-ignore
import replaceCSSURL from "replace-css-url";

export function fixAssetPath(assetPath: string): string {
  try {
    new URL(assetPath);
    return assetPath;
  } catch {
    console.log(assetPath);
    return `\${new URL("${assetPath}", import.meta.url)}`;
  }
}

export function fixAssetPathInHTMLTree(node: hast.Content | hast.Root): void {
  if ("children" in node) {
    for (const child of node.children) {
      fixAssetPathInHTMLTree(child);
    }
  }

  if (node.type === "element") {
    // TODO: make customizable
    if (node.tagName === "img" && node.properties?.src) {
      const src = String(node.properties.src);
      const newSrc = fixAssetPath(src);
      node.properties.src = newSrc;
    }
  }
}

export function fixAssetPathInCSS(css: string): string {
  console.log("fixAssetPathInCSS");
  const newCSS = replaceCSSURL(css, (url: string) => {
    return fixAssetPath(url);
  });
  return newCSS;
}
