import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ProjectFiles } from "./ProjectFiles";
import * as fs from "fs";
import shell from "shelljs";
import tmp from "tmp";
import { Project } from "@uimix/editor/src/models/Project";

describe(ProjectFiles.name, () => {
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

  it("saves", () => {
    const project = new Project();
    const page1 = project.pages.create("src/page1");
    const page2 = project.pages.create("src/page2");

    page1.node.append([project.nodes.create("frame", "frame1")]);
    page2.node.append([project.nodes.create("text", "text1")]);

    const projectFiles = new ProjectFiles(tmpObj.name + "/demo-project");
    projectFiles.projectJSON = project.toJSON();
    projectFiles.save();

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

    const projectFiles2 = new ProjectFiles(tmpObj.name + "/demo-project");
    projectFiles2.load();

    expect(projectFiles2.projectJSON).toEqual(project.toJSON());
  });

  it("watches", async () => {
    const project = new Project();
    const page1 = project.pages.create("src/page1");
    const page2 = project.pages.create("src/page2");

    page1.node.append([project.nodes.create("frame", "frame1")]);
    page2.node.append([project.nodes.create("text", "text1")]);

    const projectFiles = new ProjectFiles(tmpObj.name + "/demo-project");
    projectFiles.projectJSON = project.toJSON();

    let watchCount = 0;
    projectFiles.watch(() => {
      watchCount++;
    });
    await new Promise((resolve) => setTimeout(resolve, 500));

    // saves not cause watch
    projectFiles.save();
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(0);

    // change file
    fs.rmSync(tmpObj.name + "/demo-project/src/page1.uimix");
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(watchCount).toBe(1);

    project.loadJSON(projectFiles.projectJSON);

    expect(project.pages.all.map((page) => page.filePath)).toEqual([
      "src/page2",
    ]);
  });
});
