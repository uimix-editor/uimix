import { describe, expect, it } from "vitest";
import { generateCode } from "./generateCode";
import { WorkspaceLoader } from "../project/WorkspaceLoader";
import * as path from "path";
import { NodeFileAccess } from "../project/NodeFileAccess";

describe(generateCode.name, () => {
  it("generates code", async () => {
    const rootDir = path.resolve("../sandbox");
    const files = await WorkspaceLoader.load(new NodeFileAccess(rootDir));
    const json = files.json;
    const code = await generateCode(rootDir, json);
    const result: Record<string, string> = {};
    for (const file of code) {
      if (
        file.filePath.includes("components.") &&
        typeof file.content === "string"
      ) {
        result[file.filePath] = file.content;
      }
    }

    expect(result).toMatchSnapshot();
  });
});
