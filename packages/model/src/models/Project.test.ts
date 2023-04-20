import { describe, expect, it } from "vitest";
import { Project } from "./Project";
// @ts-ignore
import projectJSONFile from "./__fixtures__/project.uimixproject?raw";
import { ProjectJSON } from "../data/v1";

describe(Project.name, () => {
  describe("loadJSON", () => {
    it("works", async () => {
      const projectJSON = ProjectJSON.parse(
        JSON.parse(projectJSONFile as string)
      );

      const project = new Project();
      project.loadJSON(projectJSON);

      expect([...project.nodes.data.keys()]).toMatchSnapshot();
      expect([...project.selectables.stylesData.keys()]).toMatchSnapshot();
      expect(project.imageManager.images.toJSON()).toMatchSnapshot();
      expect(project.componentURLs).toMatchSnapshot();
      expect(project.toJSON()).toEqual(projectJSON);
    });
  });

  describe("toJSON", () => {
    it("works ", async () => {
      const projectJSON = ProjectJSON.parse(
        JSON.parse(projectJSONFile as string)
      );

      const project = new Project();
      project.loadJSON(projectJSON);

      const outputJSON = project.toJSON();

      expect(outputJSON).toEqual(projectJSON);
    });
  });
});
