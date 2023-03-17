import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as Y from "yjs";
import { ProjectJSON } from "@uimix/node-data";
import { loadProjectJSON } from "./ProjectJSON";
import { Project } from "./Project";
import { selectablesToProjectJSON } from "./Selectable";

describe(selectablesToProjectJSON.name, () => {
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

    const partial = selectablesToProjectJSON(
      project.pages.all[0].selectable.children
    );

    expect(partial).toMatchSnapshot();
  });
});
