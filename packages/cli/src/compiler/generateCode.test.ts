import { describe, expect, it } from "vitest";
import * as path from "path";
import * as fs from "fs";
import { generateCode } from "./generateCode";

describe(generateCode.name, () => {
  it("generates code", () => {
    const uimixPath = "../../../sandbox/src/uimix";
    const json = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, uimixPath, "data.json"), "utf8")
    );
    const imageFiles = fs.readdirSync(
      path.resolve(__dirname, uimixPath, "images")
    );
    const code = generateCode(json, imageFiles);
    expect(code).toMatchSnapshot();
  });
});
