import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ProjectFiles } from "./ProjectFiles";
import * as path from "path";
import * as fs from "fs";
import shell from "shelljs";
import tmp from "tmp";
import { Project } from "@uimix/editor/src/models/Project";
import * as Y from "yjs";
import {
  loadProjectJSON,
  toProjectJSON,
} from "@uimix/editor/src/models/ProjectJSON";

describe(ProjectFiles.name, () => {
  let tmpObj: tmp.DirResult;

  beforeEach(async () => {
    tmpObj = tmp.dirSync({
      unsafeCleanup: true,
    });

    shell.cp(
      "-R",
      path.resolve(__dirname, "__fixtures__/demo-project"),
      tmpObj.name
    );
  });

  afterEach(async () => {
    tmpObj.removeCallback();
  });

  it("loads", () => {
    const projectFiles = new ProjectFiles(tmpObj.name + "/demo-project");
    projectFiles.load();

    expect(projectFiles.toProjectJSON()).toMatchSnapshot();
  });

  it("saves", () => {
    const projectFiles = new ProjectFiles(tmpObj.name + "/demo-project");
    projectFiles.load();

    const ydoc = new Y.Doc();
    const project = new Project(ydoc);
    loadProjectJSON(ydoc, projectFiles.toProjectJSON());
    console.log(project.node.id);

    project.pages.all[0].node.children[0].name = "Hello World!";

    projectFiles.loadProjectJSON(toProjectJSON(ydoc));

    projectFiles.save();

    // check if components.uimix is correct

    const componentsUimix = fs.readFileSync(
      tmpObj.name + "/demo-project/src/components.uimix",
      "utf-8"
    );

    expect(componentsUimix).toMatchSnapshot();
  });
});
