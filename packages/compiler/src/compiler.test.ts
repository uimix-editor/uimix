import url from "url";
import path from "path";
import fs from "fs";
import { compile } from "./compiler";

const __filename = url.fileURLToPath(import.meta.url);
const fixtureFilePath = path.resolve(
  __filename,
  "../../../test-project/src/test.macaron"
);

describe(compile, () => {
  it("compiles", () => {
    const data = fs.readFileSync(fixtureFilePath, "utf-8");
    const out = compile(data, "src/test.macaron", "test.js");
    expect(out).toMatchSnapshot();
  });
});
