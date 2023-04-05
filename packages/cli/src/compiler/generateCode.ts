import { ProjectJSON } from "@uimix/node-data";
import { Project } from "@uimix/editor/src/models/Project";
import { loadProjectJSON } from "@uimix/editor/src/models/ProjectJSON";
import { formatTypeScript } from "../format.js";
import { CSSGenerator } from "./CSSGenerator.js";
import * as Y from "yjs";
import { ReactGenerator } from "./ReactGenerator.js";
import { dataUriToBuffer } from "data-uri-to-buffer";
import * as mime from "mime-types";
import { posix as path } from "path";

export async function generateCode(
  rootPath: string,
  projectJSON: ProjectJSON
): Promise<
  {
    filePath: string;
    content: string | Buffer;
  }[]
> {
  const ydoc = new Y.Doc();
  const project = new Project(ydoc);
  loadProjectJSON(ydoc, projectJSON);

  const imageFiles: {
    hash: string;
    filePath: string;
    content: string | Buffer;
  }[] = [];

  for (const [hash, image] of Object.entries(projectJSON.images ?? {})) {
    const decoded = dataUriToBuffer(image.url);
    const suffix = mime.extension(decoded.type) || "bin";
    imageFiles.push({
      hash,
      filePath: `images/${hash}.${suffix}`,
      content: decoded,
    });
  }

  const results: {
    filePath: string;
    content: string | Buffer;
  }[] = [];

  for (const page of project.pages.all) {
    const basename = path.basename(page.filePath);
    const tsContent = formatTypeScript(
      new ReactGenerator(rootPath, page).render().join("\n")
    );
    const cssContent = new CSSGenerator(page).generate();

    results.push(
      {
        filePath: basename + ".tsx",
        content: tsContent,
      },
      {
        filePath: basename + ".css",
        content: cssContent,
      }
    );
  }

  return results;
}
