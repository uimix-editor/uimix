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

const assetAttributes = {
  video: ["src", "poster"],
  source: ["src"],
  img: ["src"],
  image: ["xLinkHref", "href"],
  use: ["xLinkHref", "href"],
};

export function fixAssetPathInHTMLTree(node: hast.Content | hast.Root): void {
  if ("children" in node) {
    for (const child of node.children) {
      fixAssetPathInHTMLTree(child);
    }
  }

  if (node.type === "element" && node.properties) {
    const tagName = node.tagName.toLowerCase();
    if (tagName in assetAttributes) {
      for (const attribute of assetAttributes[
        tagName as keyof typeof assetAttributes
      ]) {
        const value = node.properties?.[attribute];
        if (typeof value === "string") {
          node.properties[attribute] = fixAssetPath(value);
        }
      }
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
