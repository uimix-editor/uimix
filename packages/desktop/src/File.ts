import fs from "fs";
import path from "path";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { ProjectJSON } from "../../node-data/src";
import { DocumentMetadata } from "../../dashboard/src/types/DesktopAPI";

export class File {
  constructor(filePath: string) {
    this.filePath = filePath;
    this.data = ProjectJSON.parse(
      JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }))
    );

    // TODO: watch file
  }

  get name(): string {
    return path.basename(this.filePath);
  }

  get metadata(): DocumentMetadata {
    return {
      name: this.name,
    };
  }

  filePath: string;
  data: ProjectJSON;

  save(data: ProjectJSON) {
    this.data = data;
    fs.writeFileSync(this.filePath, formatJSON(JSON.stringify(data)));
  }
}

function formatJSON(text: string): string {
  return prettier.format(text, {
    parser: "json",
    plugins: [parserBabel],
  });
}
