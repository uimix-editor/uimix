import * as path from "path";
import { DesignTokens } from "@uimix/code-asset-types";
import { ProjectJSON, ProjectManifestJSON } from "@uimix/model/src/data/v1";
import { Project } from "@uimix/model/src/models";
import { formatTypeScript } from "../format.js";
import { codeAssetsDestination } from "../codeAssets/constants.js";
import { stringifyAsJSX } from "../files/HumanReadableFormat.js";
import { ProjectEmitter } from "../files/ProjectEmitter.js";
import { ProjectLoader } from "../files/ProjectLoader.js";
import { CSSGenerator } from "./CSSGenerator.js";
import { ReactGenerator } from "./ReactGenerator.js";
import { ClassNameGenerator } from "./ClassNameGenerator.js";

export async function generateCode(
  rootPath: string,
  manifest: ProjectManifestJSON,
  projectJSON: ProjectJSON,
  imagePaths: Map<string, string>
): Promise<
  {
    filePath: string;
    content: string | Buffer;
  }[]
> {
  const project = new Project();
  project.loadJSON(projectJSON);

  const codeAssetJSPath = path.resolve(
    rootPath,
    codeAssetsDestination.directory,
    codeAssetsDestination.js
  );
  // eslint-disable-next-line
  const codeAssetJS: {
    tokens: DesignTokens;
  } = await import(codeAssetJSPath);
  const designTokens = codeAssetJS.tokens;

  const results: {
    filePath: string;
    content: string | Buffer;
  }[] = [];

  const classNameGenerator = new ClassNameGenerator(project);

  for (const page of project.pages.all) {
    const tsContent = formatTypeScript(
      new ReactGenerator({
        rootPath,
        manifest,
        page,
        imagePaths,
        classNameGenerator,
      })
        .render()
        .join("\n")
    );
    const cssContent = new CSSGenerator(
      page,
      designTokens,
      classNameGenerator
    ).generate();

    results.push(
      {
        filePath: page.filePath + ".uimix.tsx",
        content: tsContent,
      },
      {
        filePath: page.filePath + ".uimix.css",
        content: cssContent,
      }
    );
  }

  const projectEmitter = new ProjectEmitter(project);

  for (const [filePath, result] of projectEmitter.emit()) {
    results.push({
      filePath: filePath + ".newformat.js",
      content: formatTypeScript(stringifyAsJSX(result)),
    });
  }

  // re-emit the project

  {
    const loader = new ProjectLoader();
    loader.load(projectEmitter.emit());

    const projectEmitter2 = new ProjectEmitter(loader.project);

    for (const [filePath, result] of projectEmitter2.emit()) {
      console.log(filePath);
      results.push({
        filePath: filePath + ".2.newformat.js",
        content: formatTypeScript(stringifyAsJSX(result)),
      });
    }
  }

  return results;
}
