import { describe, expect, it } from "vitest";
import { getPageID } from "./index";
import { getURLSafeBase64Hash } from "@uimix/foundation/src/utils/Hash";
import { Buffer } from "buffer";

describe(getPageID.name, () => {
  it("works", async () => {
    const pageName = "src/pages/Home";
    const hash = await getURLSafeBase64Hash(Buffer.from(pageName));

    expect(getPageID(pageName)).toMatchInlineSnapshot(
      '"3NGv6dlSjYu3v48s5y4CwAH7mKVI7xPlNWRDDReh-3Y"'
    );
    expect(getPageID(pageName)).toBe(hash);
  });
});
