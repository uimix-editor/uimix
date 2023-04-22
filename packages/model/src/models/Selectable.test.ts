import { describe, expect, it } from "vitest";
import { Project } from "./Project";
import { selectablesToProjectJSON } from "./Selectable";
import * as Data from "../data/v1";
// @ts-ignore
import projectJSONFile from "./__fixtures__/project.uimixproject?raw";

describe(selectablesToProjectJSON.name, () => {
  it("works", async () => {
    const projectJSON = Data.ProjectJSON.parse(
      JSON.parse(projectJSONFile as string)
    );

    const project = new Project();
    project.loadJSON(projectJSON);

    const partial = selectablesToProjectJSON(
      project.pages.all[0].selectable.children
    );

    expect(partial).toMatchSnapshot();
  });
});
