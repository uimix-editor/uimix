import * as path from "path";
import slash from "slash";
import type * as hast from "hast";
// @ts-ignore
import replaceCSSURL from "replace-css-url";

export function fixAssetPath(
  assetPath: string,
  filePath: string,
  publicPath: string
): string {
  try {
    new URL(assetPath);
    return assetPath;
  } catch {
    filePath = slash(path.resolve(filePath));
    publicPath = slash(path.resolve(publicPath));

    const absolutePath = path.posix.resolve(
      path.posix.dirname(filePath),
      assetPath
    );

    const relativePath = path.posix.relative(publicPath, absolutePath);

    return relativePath;
  }
}

export function fixAssetPathInHTMLTree(
  node: hast.Content | hast.Root,
  filePath: string,
  publicPath: string
): void {
  if ("children" in node) {
    for (const child of node.children) {
      fixAssetPathInHTMLTree(child, filePath, publicPath);
    }
  }

  if (node.type === "element") {
    // TODO: make customizable
    if (node.tagName === "img" && node.properties?.src) {
      const src = String(node.properties.src);
      const newSrc = fixAssetPath(src, filePath, publicPath);
      console.log(src, newSrc);
      node.properties.src = newSrc;
    }
  }
}

export function fixAssetPathInCSS(
  css: string,
  filePath: string,
  publicPath: string
): void {
  const newCSS = replaceCSSURL(css, (url: string) => {
    return fixAssetPath(url, filePath, publicPath);
  });
  return newCSS;
}
