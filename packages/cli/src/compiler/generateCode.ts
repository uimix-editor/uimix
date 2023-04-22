import * as path from "path";
import { DesignTokens } from "@uimix/code-asset-types";
import * as Data from "@uimix/model/src/data/v1";
import { Project } from "@uimix/model/src/models";
import { formatTypeScript } from "../format.js";
import { codeAssetsDestination } from "../codeAssets/constants.js";
import { CSSGenerator } from "./CSSGenerator.js";
import { ReactGenerator } from "./ReactGenerator.js";
import { ClassNameGenerator } from "./ClassNameGenerator.js";

export async function generateCode(
  rootPath: string,
  manifest: Data.ProjectManifest,
  projectJSON: Data.Project,
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

  return results;
}
