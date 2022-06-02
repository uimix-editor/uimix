import { describe, it, expect } from "vitest";
import { solveVariantDependencies, Variant } from "./Variant";

describe(solveVariantDependencies.name, () => {
  it("", () => {
    const tablet = new Variant("tablet");
    tablet.mediaQuery = "(max-width: 1024px)";

    const smallMobile = new Variant("smallMobile");
    smallMobile.mediaQuery = "(max-width: 640px)";

    const mobile = new Variant("mobile");
    mobile.mediaQuery = "(max-width: 768px)";

    const mobileHoverFocus = new Variant("mobileHoverFocus");
    mobileHoverFocus.mediaQuery = "(max-width: 768px)";
    mobileHoverFocus.selector = ":hover:focus";

    const tabletHover = new Variant("tabletHover");
    tabletHover.mediaQuery = "(max-width: 1024px)";
    tabletHover.selector = ":hover";

    const variants = [
      tablet,
      smallMobile,
      mobile,
      mobileHoverFocus,
      tabletHover,
    ];

    const depsMap = solveVariantDependencies(variants);

    const depsData: Record<string, string[]> = {};
    for (const [variant, deps] of depsMap) {
      depsData[variant.key] = deps.map((v) => v.key);
    }

    expect(depsData).toMatchInlineSnapshot(`
      {
        "mobile": [
          "tablet",
        ],
        "mobileHoverFocus": [
          "tabletHover",
          "mobile",
          "tablet",
        ],
        "smallMobile": [
          "mobile",
          "tablet",
        ],
        "tablet": [],
        "tabletHover": [
          "tablet",
        ],
      }
    `);
  });
});
