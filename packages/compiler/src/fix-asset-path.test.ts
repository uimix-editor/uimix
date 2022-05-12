import { fixAssetPath } from "./fix-asset-path";

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
