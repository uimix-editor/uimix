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

    const files = await generateCode(
      rootDir,
      // TODO: better args
      workspaceLoader.rootProject.manifest,
      workspaceLoader.rootProject.project.toJSON(),
      workspaceLoader.rootProject.imagePaths
    );

    for (const file of files) {
      if (typeof file.content === "string") {
        expect(file.content).toMatchSnapshot(file.filePath);
      }
    }
  });
});
