import type * as hast from "hast";
import {
  fixAssetPath,
  fixAssetPathInCSS,
  fixAssetPathInHTMLTree,
} from "./fix-asset-path";
import { parseHTMLFragment } from "./util";

describe(fixAssetPath, () => {
  const filePath = "src/components.macaron";
  const publicPath = "public";

  it("fixes asset path based on filePath and publicPath", () => {
    const assetPath = "../public/images/logo.png";

    const newAssetPath = fixAssetPath(assetPath, filePath, publicPath);
    expect(newAssetPath).toBe("images/logo.png");
  });

  it("ignores URLs with protocol", () => {
    const assetPath = "https://example.com/images/logo.png";

    const newAssetPath = fixAssetPath(assetPath, filePath, publicPath);
    expect(newAssetPath).toBe(assetPath);
  });

  it("ignores data URLs", () => {
    const assetPath = "data:image/png;base64,...";

    const newAssetPath = fixAssetPath(assetPath, filePath, publicPath);
    expect(newAssetPath).toBe(assetPath);
  });
});

describe(fixAssetPathInHTMLTree, () => {
  const filePath = "src/components.macaron";
  const publicPath = "public";

  it("fixes asset path based on filePath and publicPath", () => {
    const ast = parseHTMLFragment(
      `<img src="../public/images/logo.png"><img src="https://example.com/images/logo.png">`
    );

    fixAssetPathInHTMLTree(ast, filePath, publicPath);

    console.log(ast.children);

    expect((ast.children[0] as hast.Element).properties!.src).toBe(
      "images/logo.png"
    );
    expect((ast.children[1] as hast.Element).properties!.src).toBe(
      "https://example.com/images/logo.png"
    );
  });
});

describe(fixAssetPathInCSS, () => {
  const filePath = "src/components.macaron";
  const publicPath = "public";

  it("fixes asset path based on filePath and publicPath", () => {
    const css = `
      background-image: url("../public/images/logo.png");
      background-image: url('../public/images/logo.png');
      background-image: url(../public/images/logo.png);
      background-image: url(https://example.com/images/logo.png);
      background-image: url(data:image/png;base64,);
    `;

    const newCSS = fixAssetPathInCSS(css, filePath, publicPath);
    expect(newCSS).toBe(`
      background-image: url("images/logo.png");
      background-image: url('images/logo.png');
      background-image: url(images/logo.png);
      background-image: url(https://example.com/images/logo.png);
      background-image: url(data:image/png;base64,);
    `);
  });
});
