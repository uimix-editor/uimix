import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { loadProjectJSON, toProjectJSON } from "./ProjectJSON";
import { Project } from "./Project";
import * as path from "path";
import { ProjectFiles } from "../../../cli/src/compiler/ProjectFiles";

describe(loadProjectJSON.name, () => {
  it("works", () => {
    const rootDir = path.resolve("../sandbox");
    const projectFiles = new ProjectFiles(rootDir, {
      filePattern: "src/components.uimix",
    });
    projectFiles.load();
    const projectJSON = projectFiles.projectJSON;

    const ydoc = new Y.Doc();
    const project = new Project(ydoc);
    loadProjectJSON(ydoc, projectJSON);

    expect([...project.nodes.data.keys()]).toMatchSnapshot();
    expect([...project.selectables.stylesData.keys()]).toMatchSnapshot();
    expect(project.imageManager.images.toJSON()).toMatchSnapshot();
    expect(project.componentURLs).toMatchSnapshot();
    expect(toProjectJSON(ydoc)).toEqual(projectJSON);
  });
});
