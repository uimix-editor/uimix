import { describe, expect, it } from "vitest";
import { Project } from "@uimix/model/src/models/Project";
import { ProjectEmitter } from "./ProjectEmitter";
import { ProjectLoader } from "./ProjectLoader";
import { loadFromJSXFile, stringifyAsJSXFile } from "./HumanReadableFormat";
import { formatTypeScript } from "../format";
// @ts-ignore
import projectJSONFile from "../../../model/src/models/__fixtures__/project.uimixproject?raw";
import { ProjectJSON } from "@uimix/model/src/data/v1";

describe(ProjectEmitter.name, () => {
  it("works", async () => {
    const projectJSON = ProjectJSON.parse(
      JSON.parse(projectJSONFile as string)
    );
    const project = new Project();
    project.loadJSON(projectJSON);

    const emitter = new ProjectEmitter(project);

    const emitted = emitter.emit();
    const emittedFiles = new Map(
      [...emitted.entries()].map(([path, content]) => {
        return [path, formatTypeScript(stringifyAsJSXFile(content))];
      })
    );
    for (const [path, content] of emittedFiles) {
      expect(content).toMatchSnapshot(path);
    }

    const parsedFiles = new Map(
      [...emittedFiles.entries()].map(([path, content]) => {
        return [path, loadFromJSXFile(content)];
      })
    );
    //expect(parsed).toEqual(emitted.get("src/components"));

    const loader = new ProjectLoader();
    loader.load(parsedFiles);

    const emitted2 = new ProjectEmitter(loader.project).emit();

    for (const [path, content] of emitted2) {
      expect(content).toEqual(emitted.get(path));
    }

    // const projectJSON: ProjectJSON = {
    //   nodes: {
    //     project: {
    //       type: "project",
    //       index: 0,
    //     },
    //   },
    //   styles: {},
    //   componentURLs: [],
    //   images: {},
    //   colors: {},
    // };
    // loadProject(projectJSON, emitter.emit());

    // const newProject = new Project();
    // newProject.data.loadJSON(projectJSON);

    // const emitted2 = new ProjectFileEmitter(newProject.data.toJSON()).emit();
    // expect(emitted2).toMatchSnapshot();
  });
});
