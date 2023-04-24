import { describe, expect, it } from "vitest";
import { generateCode } from "./generateCode";
import { ProjectIO } from "../project/ProjectIO";
import * as path from "path";
import { NodeFileAccess } from "../project/NodeFileAccess";

describe(generateCode.name, () => {
  it("generates code", async () => {
    const rootDir = path.resolve("../sandbox");

    const projectIO = await ProjectIO.load(new NodeFileAccess(), rootDir);

    // FIXME: you need to build code assets before generating code

    const files = await generateCode(
      rootDir,
      // TODO: better args
      projectIO.content.manifest,
      projectIO.content.project.toJSON(),
      projectIO.content.imagePaths
    );

    for (const file of files) {
      if (typeof file.content === "string") {
        expect(file.content).toMatchSnapshot(file.filePath);
      }
    }
  });
});
