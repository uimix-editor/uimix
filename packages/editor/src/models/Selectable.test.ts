import { describe, expect, it } from "vitest";
import { Project } from "./Project";
import { selectablesToProjectJSON } from "./Selectable";
import * as path from "path";
import { ProjectFiles } from "../../../cli/src/project/ProjectFiles";

describe(selectablesToProjectJSON.name, () => {
  it("works", () => {
    const rootDir = path.resolve("../sandbox");
    const projectFiles = ProjectFiles.load(rootDir, {
      filePattern: "src/components.uimix",
    });
    const projectJSON = projectFiles.json;

    const project = new Project();
    project.loadJSON(projectJSON);

    const partial = selectablesToProjectJSON(
      project.pages.all[0].selectable.children
    );

    expect(partial).toMatchSnapshot();
  });
});
