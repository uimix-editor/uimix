import { describe, expect, it } from "vitest";
import { generateCode } from "./generateCode";
import { WorkspaceLoader } from "../project/WorkspaceLoader";
import * as path from "path";
import { NodeFileAccess } from "../project/NodeFileAccess";

describe(generateCode.name, () => {
  it("generates code", async () => {
    const rootDir = path.resolve("../sandbox");

    const workspaceLoader = await WorkspaceLoader.load(
      new NodeFileAccess(rootDir)
    );

    // FIXME: you need to build code assets before generating code

    const code = await generateCode(
      rootDir,
      // TODO: better args
      workspaceLoader.rootProject.manifest,
      workspaceLoader.rootProject.project.toJSON(),
      workspaceLoader.rootProject.imagePaths
    );
    const result: Record<string, string> = {};
    for (const file of code) {
      if (
        file.filePath.includes("components.uimix.") &&
        typeof file.content === "string"
      ) {
        result[file.filePath] = file.content;
      }
    }

    expect(result).toMatchSnapshot();
  });
});
