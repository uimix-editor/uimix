import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { ProjectJSON } from "@uimix/node-data";
import { loadProjectJSON } from "./ProjectJSON";
import { Project } from "./Project";
import { selectablesToProjectJSON } from "./Selectable";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import uimixFile from "../../../sandbox/src/uimix/components.uimix?raw";

describe(selectablesToProjectJSON.name, () => {
  it("works", () => {
    const projectJSON = ProjectJSON.parse(JSON.parse(uimixFile));

    const ydoc = new Y.Doc();
    const project = new Project(ydoc);
    loadProjectJSON(ydoc, projectJSON);

    const partial = selectablesToProjectJSON(
      project.pages.all[0].selectable.children
    );

    expect(partial).toMatchSnapshot();
  });
});
