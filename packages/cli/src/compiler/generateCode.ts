import { ProjectJSON } from "@uimix/node-data";
import { Project } from "@uimix/editor/src/models/Project";
import { formatTypeScript } from "../format.js";
import { CSSGenerator } from "./CSSGenerator.js";
import * as Y from "yjs";
import { ReactGenerator } from "./ReactGenerator.js";

export function generateCode(
  projectJSON: ProjectJSON,
  imageFiles: string[]
): {
  suffix: string;
  content: string;
}[] {
  const ydoc = new Y.Doc();
  const project = new Project(ydoc);
  project.loadJSON(projectJSON);

  const tsContent = formatTypeScript(
    new ReactGenerator(project, imageFiles).render().join("\n")
  );
  const cssContent = new CSSGenerator(project).generate();
  return [
    {
      suffix: ".tsx",
      content: tsContent,
    },
    {
      suffix: ".css",
      content: cssContent,
    },
  ];
}
