import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as Y from "yjs";
import { ProjectJSON } from "@uimix/node-data";
import { loadProjectJSON, toProjectJSON } from "./ProjectJSON";
import { Project } from "./Project";

describe(loadProjectJSON.name, () => {
  it("works", () => {
    const projectJSON = ProjectJSON.parse(
      JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "__fixtures__/project.json"),
          "utf8"
        )
      )
    );

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
