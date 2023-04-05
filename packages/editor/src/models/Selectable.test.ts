import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { loadProjectJSON } from "./ProjectJSON";
import { Project } from "./Project";
import { selectablesToProjectJSON } from "./Selectable";
import * as path from "path";
import { ProjectFiles } from "../../../cli/src/compiler/ProjectFiles";

describe(selectablesToProjectJSON.name, () => {
  it("works", () => {
    const rootDir = path.resolve("../sandbox");
    const projectFiles = new ProjectFiles(rootDir, {
      filePattern: "src/uimix/components.uimix",
    });
    projectFiles.load();
    const projectJSON = projectFiles.toProjectJSON();

    const ydoc = new Y.Doc();
    const project = new Project(ydoc);
    loadProjectJSON(ydoc, projectJSON);

    const partial = selectablesToProjectJSON(
      project.pages.all[0].selectable.children
    );

    expect(partial).toMatchSnapshot();
  });
});
