import url from "url";
import path from "path";
import fs from "fs";
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
    expect(out).toMatchSnapshot();
  });
});
