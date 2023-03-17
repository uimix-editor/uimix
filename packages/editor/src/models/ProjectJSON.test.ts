import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { ProjectJSON } from "@uimix/node-data";
import { loadProjectJSON, toProjectJSON } from "./ProjectJSON";
import { Project } from "./Project";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import uimixFile from "../../../sandbox/src/uimix/components.uimix?raw";

describe(loadProjectJSON.name, () => {
  it("works", () => {
    const projectJSON = ProjectJSON.parse(JSON.parse(uimixFile));

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
