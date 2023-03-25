import fs from "fs";
import path from "path";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { ProjectJSON } from "../../node-data/src";
import { DocumentMetadata } from "../../dashboard/src/types/DesktopAPI";
import { TypedEmitter } from "tiny-typed-emitter";
import { dialog } from "electron";

export class File extends TypedEmitter<{
  metadataChanged: (metadata: DocumentMetadata) => void;
}> {
  constructor(filePath?: string) {
    super();

    this.filePath = filePath;
    this.data = filePath
      ? ProjectJSON.parse(
          JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }))
        )
      : // default project
        {
          nodes: {
            project: { type: "project", index: 0 },
          },
          styles: {},
        };
  }

  get name(): string {
    return this.filePath ? path.basename(this.filePath) : "Untitled";
  }

  get metadata(): DocumentMetadata {
    return {
      name: this.name,
    };
  }

  filePath?: string;
  data: ProjectJSON;

  save() {
    if (!this.filePath) {
      this.saveAs();
      return;
    }
    fs.writeFileSync(this.filePath, formatJSON(JSON.stringify(this.data)));
  }

  saveAs() {
    const newPath = dialog.showSaveDialogSync({
      filters: [{ name: "UI Mix", extensions: ["uimix"] }],
    })?.[0];
    if (!newPath) {
      return;
    }

    this.filePath = newPath;
    this.save();

    this.emit("metadataChanged", this.metadata);
  }

  static open() {
    const filePath = dialog.showOpenDialogSync({
      properties: ["openFile"],
      filters: [{ name: "UI Mix", extensions: ["uimix"] }],
    })?.[0];
    if (!filePath) {
      return;
    }
    return new File(filePath);
  }
}

function formatJSON(text: string): string {
  return prettier.format(text, {
    parser: "json",
    plugins: [parserBabel],
  });
}
