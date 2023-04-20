import { describe, expect, it } from "vitest";
import { generateCode } from "./generateCode";
import { WorkspaceLoader } from "../project/WorkspaceLoader";
import * as path from "path";
import { NodeFileAccess } from "../project/NodeFileAccess";
// @ts-ignore
import projectJSONFile from "../../../model/src/models/__fixtures__/project.uimixproject?raw";
import { ProjectJSON } from "@uimix/model/src/data/v1";

describe(generateCode.name, () => {
  it("generates code", async () => {
    const rootDir = path.resolve("../sandbox");
    // TODO: use WorkspaceLoader
    const projectJSON = ProjectJSON.parse(
      JSON.parse(projectJSONFile as string)
    );
    const code = await generateCode(
      rootDir,
      {
        components: {
          react: ["./src/stories/*.tsx", "!./src/stories/*.stories.tsx"],
        },
        designTokens: "./src/designTokens.ts",
      },
      projectJSON
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
