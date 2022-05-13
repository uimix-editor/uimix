import path from "path";
import type * as hast from "hast";
// @ts-ignore
import replaceCSSURL from "replace-css-url";
import slash from "slash";

export function fixAssetPath(
  assetPath: string,
  filePath = ".",
  outFilePath = "."
): string {
  try {
    new URL(assetPath);
    return assetPath;
  } catch {
    filePath = slash(filePath);
    outFilePath = slash(outFilePath);

    const absAssetPath = path.posix.resolve(
      path.posix.dirname(filePath),
      assetPath
    );
    const assetPathFromOut = path.posix.relative(
      path.posix.dirname(outFilePath),
      absAssetPath
    );

    return `\${new URL("${assetPathFromOut}", import.meta.url)}`;
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

export function fixAssetPathInHTMLTree(
  node: hast.Content | hast.Root,
  filePath = ".",
  outFilePath = "."
): void {
  if ("children" in node) {
    for (const child of node.children) {
      fixAssetPathInHTMLTree(child, filePath, outFilePath);
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
          node.properties[attribute] = fixAssetPath(
            value,
            filePath,
            outFilePath
          );
        }
      }
    }
  }
}

export function fixAssetPathInCSS(
  css: string,
  filePath = ".",
  outFilePath = "."
): string {
  // eslint-disable-next-line
  const newCSS: string = replaceCSSURL(css, (url: string) => {
    return fixAssetPath(url, filePath, outFilePath);
  });
  return newCSS;
}
