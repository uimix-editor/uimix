import { describe, expect, it } from "vitest";
import { generateCode } from "./generateCode";
import { ProjectFiles } from "./ProjectFiles";
import * as path from "path";

describe(generateCode.name, () => {
  it("generates code", async () => {
    const rootDir = path.resolve("../sandbox");
    const files = new ProjectFiles(rootDir);
    files.loadFiles();
    const json = files.toProjectJSON();
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
