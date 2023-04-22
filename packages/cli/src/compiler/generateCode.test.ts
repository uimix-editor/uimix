import { describe, expect, it } from "vitest";
import { generateCode } from "./generateCode";
import { WorkspaceIO } from "../project/WorkspaceIO";
import * as path from "path";
import { NodeFileAccess } from "../project/NodeFileAccess";

describe(generateCode.name, () => {
  it("generates code", async () => {
    const rootDir = path.resolve("../sandbox");

    const workspaceIO = await WorkspaceIO.load(new NodeFileAccess(rootDir));

    // FIXME: you need to build code assets before generating code

    const files = await generateCode(
      rootDir,
      // TODO: better args
      workspaceIO.rootProject.manifest,
      workspaceIO.rootProject.project.toJSON(),
      workspaceIO.rootProject.imagePaths
    );

    for (const file of files) {
      if (typeof file.content === "string") {
        expect(file.content).toMatchSnapshot(file.filePath);
      }
    }
  });
});
