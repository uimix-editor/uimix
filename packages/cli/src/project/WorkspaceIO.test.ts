import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import shell from "shelljs";
import tmp from "tmp";
import { mkdirpSync } from "mkdirp";
import { Project } from "@uimix/model/src/models";
import { ProjectEmitter } from "@uimix/model/src/file";
import { NodeFileAccess } from "./NodeFileAccess";
import { WorkspaceIO } from "./WorkspaceIO";

describe(WorkspaceIO.name, () => {
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

    const innerProject = new Project();
    const innerPage1 = innerProject.pages.create("src/inner1");
    const innerPage2 = innerProject.pages.create("src/inner2");
    innerPage1.node.append([innerProject.nodes.create("frame", "inner1")]);
    innerPage2.node.append([innerProject.nodes.create("frame", "inner2")]);

    const deepInnerProject = new Project();
    deepInnerProject.pages.create("src/inner1");

    const innerProjectPath = tmpObj.name + "/demo-project/inner";
    const deepInnerProjectPath = tmpObj.name + "/demo-project/inner/inner";

    const workspaceIO = new WorkspaceIO(
      new NodeFileAccess(tmpObj.name + "/demo-project")
    );
    workspaceIO.rootProject.project = project;
    workspaceIO.projects.set(innerProjectPath, {
      manifest: {},
      project: innerProject,
      pages: new Map(),
      imagePaths: new Map(),
    });
    workspaceIO.projects.set(deepInnerProjectPath, {
      manifest: {},
      project: deepInnerProject,
      pages: new Map(),
      imagePaths: new Map(),
    });
    await workspaceIO.save();

    fs.writeFileSync(tmpObj.name + "/demo-project/inner/package.json", "{}");
    fs.writeFileSync(
      tmpObj.name + "/demo-project/inner/inner/package.json",
      "{}"
    );

    expect(
      workspaceIO.projectPathForFile(
        tmpObj.name + "/demo-project/src/page1.uimix"
      )
    ).toEqual(tmpObj.name + "/demo-project");
    expect(
      workspaceIO.projectPathForFile(
        tmpObj.name + "/demo-project/inner/src/inner1.uimix"
      )
    ).toEqual(tmpObj.name + "/demo-project/inner");

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

    const innerPage1File = fs.readFileSync(
      tmpObj.name + "/demo-project/inner/src/inner1.uimix",
      "utf8"
    );
    expect(innerPage1File).toMatchSnapshot();

    const workspaceIO2 = await WorkspaceIO.load(
      new NodeFileAccess(tmpObj.name + "/demo-project")
    );

    expect(new ProjectEmitter(workspaceIO2.rootProject.project).emit()).toEqual(
      new ProjectEmitter(project).emit()
    );
    expect(
      new ProjectEmitter(
        workspaceIO2.projects.get(innerProjectPath)!.project
      ).emit()
    ).toEqual(new ProjectEmitter(innerProject).emit());
  });

  it("watches project", async () => {
    const project = new Project();
    const page1 = project.pages.create("src/page1");
    const page2 = project.pages.create("src/page2");

    page1.node.append([project.nodes.create("frame", "frame1")]);
    page2.node.append([project.nodes.create("text", "text1")]);

    const innerProject = new Project();
    const innerPage1 = innerProject.pages.create("src/inner1");
    innerPage1.node.append([innerProject.nodes.create("frame", "inner")]);

    const workspaceIO = new WorkspaceIO(
      new NodeFileAccess(tmpObj.name + "/demo-project")
    );
    workspaceIO.rootProject.project = project;
    workspaceIO.projects.set(path.resolve(workspaceIO.rootPath, "inner"), {
      manifest: {},
      project: innerProject,
      pages: new Map(),
      imagePaths: new Map(),
    });
    mkdirpSync(tmpObj.name + "/demo-project/inner");
    fs.writeFileSync(tmpObj.name + "/demo-project/inner/package.json", "{}");
    await workspaceIO.save();
    await new Promise((resolve) => setTimeout(resolve, 500));

    let watchCount = 0;
    workspaceIO.watch(() => {
      watchCount++;
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(0);

    console.log("save");
    // saves not cause watch
    await workspaceIO.save();
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(0);

    console.log("change");
    // change file
    fs.rmSync(tmpObj.name + "/demo-project/src/page1.uimix");
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(1);

    // change inner file
    fs.rmSync(tmpObj.name + "/demo-project/inner/src/inner1.uimix");
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(2);

    expect(
      workspaceIO.rootProject.project.pages.all.map((page) => page.filePath)
    ).toEqual(["src/page2"]);
  });
});
