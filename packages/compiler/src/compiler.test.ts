import url from "url";
import path from "path";
import fs from "fs";
import * as prettier from "prettier";
import { describe, it, expect } from "vitest";
import { compile } from "./compiler";

const __filename = url.fileURLToPath(import.meta.url);
const fixtureFilePath = path.resolve(
  __filename,
  "../../../test-project/test.macaron"
);

describe(compile.name, () => {
  it("compiles", () => {
    const data = fs.readFileSync(fixtureFilePath, "utf-8");
    const out = compile(data);
    const formatted = prettier.format(out, {
      parser: "babel",
    });
    expect(formatted).toMatchSnapshot();
  });
});
