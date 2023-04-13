import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { WorkspaceLoader } from "./WorkspaceLoader";
import * as fs from "fs";
import * as path from "path";
import shell from "shelljs";
import tmp from "tmp";
import { Project } from "@uimix/model/src/models/Project";
import { NodeFileAccess } from "./NodeFileAccess";

describe(WorkspaceLoader.name, () => {
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

    const loader = new WorkspaceLoader(
      new NodeFileAccess(tmpObj.name + "/demo-project")
    );
    loader.json = project.toJSON();
    loader.jsons.set(innerProjectPath, innerProject.toJSON());
    loader.jsons.set(deepInnerProjectPath, deepInnerProject.toJSON());
    await loader.save();

    fs.writeFileSync(tmpObj.name + "/demo-project/inner/package.json", "{}");
    fs.writeFileSync(
      tmpObj.name + "/demo-project/inner/inner/package.json",
      "{}"
    );

    expect(
      loader.projectPathForFile(tmpObj.name + "/demo-project/src/page1.uimix")
    ).toEqual(tmpObj.name + "/demo-project");
    expect(
      loader.projectPathForFile(
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

    const projectFiles2 = await WorkspaceLoader.load(
      new NodeFileAccess(tmpObj.name + "/demo-project")
    );

    expect(projectFiles2.json).toEqual(project.toJSON());
    expect(projectFiles2.jsons.get(innerProjectPath)).toEqual(
      innerProject.toJSON()
    );
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

    const loader = new WorkspaceLoader(
      new NodeFileAccess(tmpObj.name + "/demo-project")
    );
    loader.json = project.toJSON();
    loader.jsons.set(
      path.resolve(loader.rootPath, "inner"),
      innerProject.toJSON()
    );
    await loader.save();

    fs.writeFileSync(tmpObj.name + "/demo-project/inner/package.json", "{}");

    let watchCount = 0;
    loader.watch(() => {
      watchCount++;
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(0);

    // saves not cause watch
    await loader.save();
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(0);

    // change file
    fs.rmSync(tmpObj.name + "/demo-project/src/page1.uimix");
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(1);

    // change inner file
    fs.rmSync(tmpObj.name + "/demo-project/inner/src/inner1.uimix");
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(watchCount).toBe(2);

    project.loadJSON(loader.json);

    expect(project.pages.all.map((page) => page.filePath)).toEqual([
      "src/page2",
    ]);
  });
});
