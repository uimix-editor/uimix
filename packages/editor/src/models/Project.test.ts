import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { Project } from "./Project";
import * as fs from "fs";
import * as path from "path";
import { ProjectJSON } from "@uimix/node-data";

describe(Project.name, () => {
  it("loads example node snapshot", () => {
    const projectJSON = ProjectJSON.parse(
      JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "__fixtures__/project.json"),
          "utf8"
        )
      )
    );

    const ydoc = new Y.Doc();
    const project = new Project(ydoc.getMap("project"));
    project.loadJSON(projectJSON);

    expect(project.toJSON()).toEqual(projectJSON);
  });
});
