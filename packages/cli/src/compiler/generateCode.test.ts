import { describe, expect, it } from "vitest";
import * as path from "path";
import * as fs from "fs";
import { generateCode } from "./generateCode";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import uimixFile from "../../../sandbox/src/uimix/components.uimix?raw";

describe(generateCode.name, () => {
  it("generates code", async () => {
    const json = JSON.parse(uimixFile);
    const code = await generateCode("../..", "components", json);
    const result: Record<string, string> = {};
    for (const file of code) {
      if (file.content instanceof Buffer) {
        result[file.filePath] = "binary";
      } else {
        result[file.filePath] = file.content;
      }
    }

    expect(result).toMatchSnapshot();
  });
});
