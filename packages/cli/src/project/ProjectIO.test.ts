import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import shell from "shelljs";
import tmp from "tmp";
import { Project } from "@uimix/model/src/models";
import { ProjectEmitter } from "@uimix/model/src/file";
import { NodeFileAccess } from "./NodeFileAccess";
import { ProjectIO } from "./ProjectIO";

describe(ProjectIO.name, () => {
  let tmpObj: tmp.DirResult;

  beforeEach(async () => {
    tmpObj = tmp.dirSync({
      unsafeCleanup: true,
    });
    shell.mkdir("-p", tmpObj.name + "/demo-project");
  });

  afterEach(async () => {
    tmpObj.removeCallback();
  });

  // it("loads", () => {
  //   const projectFiles = new ProjectFiles(tmpObj.name + "/demo-project");
  //   projectFiles.load();

  //   expect(projectFiles.toProjectJSON()).toMatchSnapshot();
  // });

  it("saves", async () => {
    const project = new Project();
    const page1 = project.pages.create("src/page1");
    const page2 = project.pages.create("src/page2");

    page1.node.append([project.nodes.create("frame", "frame1")]);
    page2.node.append([project.nodes.create("text", "text1")]);

    const projectIO = new ProjectIO(
      new NodeFileAccess(),
      tmpObj.name + "/demo-project"
    );
    projectIO.project.project = project;
    await projectIO.save();

    const page1File = fs.readFileSync(
      tmpObj.name + "/demo-project/src/page1.uimix",
      "utf8"
    );
    expect(page1File).toMatchSnapshot();

    const page2File = fs.readFileSync(
      tmpObj.name + "/demo-project/src/page2.uimix",
      "utf8"
    );
    expect(page2File).toMatchSnapshot();

    const projectIO2 = await ProjectIO.load(
      new NodeFileAccess(),
      tmpObj.name + "/demo-project"
    );

    expect(new ProjectEmitter(projectIO2.project.project).emit()).toEqual(
      new ProjectEmitter(project).emit()
    );
  });

  it("watches project", async () => {
    const project = new Project();
    const page1 = project.pages.create("src/page1");
    const page2 = project.pages.create("src/page2");

    page1.node.append([project.nodes.create("frame", "frame1")]);
    page2.node.append([project.nodes.create("text", "text1")]);

    const projectIO = new ProjectIO(
      new NodeFileAccess(),
      tmpObj.name + "/demo-project"
    );
    projectIO.project.project = project;

    await projectIO.save();
    await new Promise((resolve) => setTimeout(resolve, 500));

    let watchCount = 0;
    projectIO.watch(() => {
      watchCount++;
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(0);

    console.log("save");
    // saves not cause watch
    await projectIO.save();
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(0);

    console.log("change");
    // change file
    fs.rmSync(tmpObj.name + "/demo-project/src/page1.uimix");
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(1);

    expect(
      projectIO.project.project.pages.all.map((page) => page.filePath)
    ).toEqual(["src/page2"]);
  });
});
