import { describe, expect, it } from "vitest";
import { Project } from "../models";
import { ProjectEmitter } from "./ProjectEmitter";
import { ProjectLoader } from "./ProjectLoader";
import { loadFromJSXFile, stringifyAsJSXFile } from "./types";
import * as Data from "../data/v1";
import prettier from "prettier/standalone";
import parserTypeScript from "prettier/parser-typescript";
// @ts-ignore
import projectJSONFile from "../models/__fixtures__/project.uimixproject?raw";

function formatTypeScript(text: string): string {
  return prettier.format(text, {
    parser: "typescript",
    plugins: [parserTypeScript],
  });
}

describe(ProjectEmitter.name, () => {
  it("works", async () => {
    const projectJSON = Data.Project.parse(
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
