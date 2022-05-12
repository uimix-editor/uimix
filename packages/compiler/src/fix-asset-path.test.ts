import type * as hast from "hast";
import {
  fixAssetPath,
  fixAssetPathInCSS,
  fixAssetPathInHTMLTree,
} from "./fix-asset-path";
import { parseHTMLFragment } from "./util";

describe(fixAssetPath, () => {
  it("fixes asset path based on filePath and publicPath", () => {
    const assetPath = "./images/logo.png";

    const newAssetPath = fixAssetPath(assetPath);
    expect(newAssetPath).toBe(
      '${new URL("./images/logo.png", import.meta.url)}'
    );
  });

  it("ignores URLs with protocol", () => {
    const assetPath = "https://example.com/images/logo.png";

    const newAssetPath = fixAssetPath(assetPath);
    expect(newAssetPath).toBe(assetPath);
  });

  it("ignores data URLs", () => {
    const assetPath = "data:image/png;base64,...";

    const newAssetPath = fixAssetPath(assetPath);
    expect(newAssetPath).toBe(assetPath);
  });
});

describe(fixAssetPathInHTMLTree, () => {
  it("fixes asset path based on filePath and publicPath", () => {
    const ast = parseHTMLFragment(
      `<img src="./images/logo.png"><img src="https://example.com/images/logo.png">`
    );

    fixAssetPathInHTMLTree(ast);

    expect((ast.children[0] as hast.Element).properties!.src).toBe(
      '${new URL("./images/logo.png", import.meta.url)}'
    );
    expect((ast.children[1] as hast.Element).properties!.src).toBe(
      "https://example.com/images/logo.png"
    );
  });
});

describe(fixAssetPathInCSS, () => {
  it("fixes asset path based on filePath and publicPath", () => {
    const css = `
      background-image: url(./images/logo.png);
      background-image: url(https://example.com/images/logo.png);
      background-image: url(data:image/png;base64,);
    `;

    const newCSS = fixAssetPathInCSS(css);
    expect(newCSS).toBe(`
      background-image: url(\${new URL("./images/logo.png", import.meta.url)});
      background-image: url(https://example.com/images/logo.png);
      background-image: url(data:image/png;base64,);
    `);
  });
});
