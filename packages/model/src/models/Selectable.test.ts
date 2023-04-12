import { describe, expect, it } from "vitest";
import { Project } from "./Project";
import { selectablesToProjectJSON } from "./Selectable";
import * as path from "path";
import { WorkspaceLoader } from "../../../cli/src/project/WorkspaceLoader";
import { NodeFileAccess } from "../../../cli/src/project/NodeFileAccess";

describe(selectablesToProjectJSON.name, () => {
  it("works", async () => {
    const rootDir = path.resolve("../sandbox");
    const loader = await WorkspaceLoader.load(new NodeFileAccess(rootDir), {
      filePattern: "src/components.uimix",
    });
    const projectJSON = loader.json;

    const project = new Project();
    project.loadJSON(projectJSON);

    const partial = selectablesToProjectJSON(
      project.pages.all[0].selectable.children
    );

    expect(partial).toMatchSnapshot();
  });
});
