import { describe, expect, it } from "vitest";
import { WorkspaceLoader } from "../project/WorkspaceLoader";
import * as path from "path";
import { NodeFileAccess } from "../project/NodeFileAccess";
import { ProjectFileEmitter } from "./FileEmitter";

describe(ProjectFileEmitter.name, () => {
  it("works", async () => {
    const rootDir = path.resolve("../sandbox");
    const files = await WorkspaceLoader.load(new NodeFileAccess(rootDir));

    const emitter = new ProjectFileEmitter(files.rootProject.json);
    expect(emitter.emit()).toMatchSnapshot();
  });
});
