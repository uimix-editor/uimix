import { describe, expect, it } from "vitest";
import { generateCode } from "./generateCode";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import uimixFile from "../../../sandbox/src/uimix/components.uimix?raw";
import { ProjectJSON } from "@uimix/node-data";

describe(generateCode.name, () => {
  it("generates code", async () => {
    const json = ProjectJSON.parse(JSON.parse(uimixFile as string));
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
