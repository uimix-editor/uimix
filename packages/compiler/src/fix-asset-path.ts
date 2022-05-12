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

// From @vue/compiler-sfc/src https://github.com/vuejs/core/blob/9309b044bd4f9d0a34e0d702ed4690a529443a41/packages/compiler-sfc/src/templateTransformAssetUrl.ts#L40
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
  // eslint-disable-next-line
  const newCSS: string = replaceCSSURL(css, (url: string) => {
    return fixAssetPath(url);
  });
  return newCSS;
}
