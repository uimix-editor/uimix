import * as path from "path";
import { DesignTokens } from "@uimix/adapter-types";
import * as Data from "@uimix/model/src/data/v1";
import { Project } from "@uimix/model/src/models";
import { formatTypeScript } from "../format.js";
import { codeAssetsDestination } from "../codeAssets/constants.js";
import { CSSGenerator } from "./CSSGenerator.js";
import { ReactGenerator } from "./ReactGenerator.js";
import { ClassNameGenerator } from "./ClassNameGenerator.js";
import { ProjectManifest } from "@uimix/model/src/file/types.js";
import CleanCSS from "clean-css";

export async function generateCode(
  rootPath: string,
  manifest: ProjectManifest,
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

  let designTokens: DesignTokens = {};
  if (manifest.assets) {
    try {
      // eslint-disable-next-line
      const codeAssetJS: {
        tokens: DesignTokens;
      } = await import(codeAssetJSPath);
      designTokens = codeAssetJS.tokens;
    } catch (e) {
      console.error("Error loading code assets:");
      console.error(e);
    }
  }

  const results: {
    filePath: string;
    content: string | Buffer;
  }[] = [];

  const classNameGenerator = new ClassNameGenerator(project);
  const cleanCSS = new CleanCSS({
    level: 2,
    format: "beautify",
  });

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
    const cssContent = cleanCSS.minify(
      new CSSGenerator(page, designTokens, classNameGenerator).generate()
    ).styles;

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
