import { fixAssetPath } from "./fix-asset-path";

describe(fixAssetPath, () => {
  it("fixes asset path based on filePath and publicPath", () => {
    const assetPath = "../public/images/logo.png";
    const filePath = "src/components.macaron";
    const publicPath = "public";

    const newAssetPath = fixAssetPath(assetPath, filePath, publicPath);
    expect(newAssetPath).toBe("images/logo.png");
  });
});
