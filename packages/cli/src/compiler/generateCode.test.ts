import { describe, expect, it } from "vitest";
import * as path from "path";
import * as fs from "fs";
import { generateCode } from "./generateCode";

describe(generateCode.name, () => {
  it("generates code", async () => {
    const uimixPath = "../../../sandbox/src/uimix";
    const json = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, uimixPath, "components.uimix"),
        "utf8"
      )
    );
    const code = await generateCode("../..", "components", json);
    for (const file of code) {
      if (file.content instanceof Buffer) {
        file.content = "some binary data";
      }
    }
    expect(code).toMatchSnapshot();
  });
});
