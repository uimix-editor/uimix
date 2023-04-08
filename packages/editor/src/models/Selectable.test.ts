import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { Project } from "./Project";
import { selectablesToProjectJSON } from "./Selectable";
import * as path from "path";
import { ProjectFiles } from "../../../cli/src/compiler/ProjectFiles";

describe(selectablesToProjectJSON.name, () => {
  it("works", () => {
    const rootDir = path.resolve("../sandbox");
    const projectFiles = ProjectFiles.load(rootDir, {
      filePattern: "src/components.uimix",
    });
    const projectJSON = projectFiles.projectJSON;

    const ydoc = new Y.Doc();
    const project = new Project(ydoc);
    project.loadJSON(projectJSON);

    const partial = selectablesToProjectJSON(
      project.pages.all[0].selectable.children
    );

    expect(partial).toMatchSnapshot();
  });
});
