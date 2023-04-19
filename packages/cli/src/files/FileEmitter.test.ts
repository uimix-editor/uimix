import { describe, expect, it } from "vitest";
import { WorkspaceLoader } from "../project/WorkspaceLoader";
import * as path from "path";
import { NodeFileAccess } from "../project/NodeFileAccess";
import { ProjectFileEmitter } from "./FileEmitter";
import { Project } from "@uimix/model/src/models/Project";
import { ProjectJSON } from "@uimix/model/src/data/v1";

describe(ProjectFileEmitter.name, () => {
  it("works", async () => {
    const rootDir = path.resolve("../sandbox");
    const files = await WorkspaceLoader.load(new NodeFileAccess(rootDir));

    const emitter = new ProjectFileEmitter(files.rootProject.json);
    const emitted = emitter.emit();
    expect(emitted).toMatchSnapshot();

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
