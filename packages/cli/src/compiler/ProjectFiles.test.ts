import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ProjectFiles } from "./ProjectFiles";
import * as path from "path";
import * as fs from "fs";
import shell from "shelljs";
import tmp from "tmp";

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

  it("should work", () => {
    const projectFiles = new ProjectFiles(tmpObj.name + "/demo-project");
    projectFiles.load();

    expect(projectFiles.toProjectJSON()).toMatchSnapshot();
  });
});
