import { ProjectJSON } from "@uimix/node-data";
import { Project } from "@uimix/editor/src/models/Project";
import { formatTypeScript } from "../format.js";
import { CSSGenerator } from "./CSSGenerator.js";
import * as Y from "yjs";
import { ReactGenerator } from "./ReactGenerator.js";
import dataUriToBuffer from "data-uri-to-buffer";
import * as mime from "mime-types";

export async function generateCode(
  pathToPackageRoot: string,
  basename: string,
  projectJSON: ProjectJSON
): Promise<
  {
    filePath: string;
    content: string | Buffer;
  }[]
> {
  const ydoc = new Y.Doc();
  const project = new Project(ydoc);
  project.loadJSON(projectJSON);

  const outFiles: {
    filePath: string;
    content: string | Buffer;
  }[] = [];

  const imageFiles: {
    hash: string;
    suffix: string;
  }[] = [];

  // get images
  for (const [hash, image] of Object.entries(projectJSON.images ?? {})) {
    const decoded = dataUriToBuffer(image.url);

    const suffix = mime.extension(decoded.type) ?? "bin";

    outFiles.push({
      filePath: `images/${hash}.${suffix}`,
      content: decoded,
    });
    imageFiles.push({
      hash,
      suffix: `.${suffix}`,
    });
  }

  const tsContent = formatTypeScript(
    new ReactGenerator(pathToPackageRoot, project, imageFiles)
      .render()
      .join("\n")
  );
  const cssContent = new CSSGenerator(project).generate();
  return [
    ...outFiles,
    {
      filePath: basename + ".tsx",
      content: tsContent,
    },
    {
      filePath: basename + ".css",
      content: cssContent,
    },
  ];
}
