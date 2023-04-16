import { ProjectJSON, ProjectManifestJSON } from "@uimix/model/src/data/v1";
import { Project } from "@uimix/model/src/models/Project";
import { formatTypeScript } from "../format.js";
import { CSSGenerator } from "./CSSGenerator.js";
import { ReactGenerator } from "./ReactGenerator.js";
import { dataUriToBuffer } from "data-uri-to-buffer";
import * as mime from "mime-types";

export async function generateCode(
  rootPath: string,
  manifest: ProjectManifestJSON,
  projectJSON: ProjectJSON
): Promise<
  {
    filePath: string;
    content: string | Buffer;
  }[]
> {
  const project = new Project();
  project.loadJSON(projectJSON);

  const imagesPath = ".uimix/images";

  const results: {
    filePath: string;
    content: string | Buffer;
  }[] = [];

  for (const [hash, image] of Object.entries(projectJSON.images ?? {})) {
    const decoded = dataUriToBuffer(image.url);
    const suffix = mime.extension(decoded.type) || "bin";
    results.push({
      filePath: `${imagesPath}/${hash}.${suffix}`,
      content: decoded,
    });
  }

  for (const page of project.pages.all) {
    const tsContent = formatTypeScript(
      new ReactGenerator({ rootPath, manifest, page, imagesPath })
        .render()
        .join("\n")
    );
    const cssContent = new CSSGenerator(page).generate();

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
