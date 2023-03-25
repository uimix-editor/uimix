import fs from "fs";
import path from "path";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { ProjectJSON } from "../../node-data/src";
import { DocumentMetadata } from "../../dashboard/src/types/DesktopAPI";
import { TypedEmitter } from "tiny-typed-emitter";
import { dialog } from "electron";
import { isEqual } from "lodash";
import chokidar from "chokidar";

export class File extends TypedEmitter<{
  editedChange: (edited: boolean) => void;
  metadataChange: (metadata: DocumentMetadata) => void;
  dataChange: (data: ProjectJSON) => void;
}> {
  constructor(filePath?: string) {
    super();

    this.filePath = filePath;
    this._data = filePath
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
    this.savedData = this._data;
    if (filePath) {
      this.watch();
    }
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
  edited = false;

  private _data: ProjectJSON;
  get data(): ProjectJSON {
    return this._data;
  }
  setData(data: ProjectJSON) {
    this._data = data;
    // TODO: don't compare image data
    this.edited = !isEqual(this.savedData, this._data);
    this.emit("editedChange", this.edited);
  }

  private savedData: ProjectJSON;

  revert() {
    this.setData(this.savedData);
  }

  save() {
    if (!this.filePath) {
      this.saveAs();
      return;
    }
    fs.writeFileSync(this.filePath, formatJSON(JSON.stringify(this.data)));
    this.savedData = this.data;
    this.edited = false;
    this.emit("editedChange", this.edited);
  }

  saveAs() {
    const newPath = dialog.showSaveDialogSync({
      filters: [{ name: "UI Mix", extensions: ["uimix"] }],
    });
    if (!newPath) {
      return;
    }
    console.log("newPath", newPath);

    this.filePath = newPath;
    this.save();
    this.watch();

    this.emit("metadataChange", this.metadata);
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

  watch() {
    if (this.watchDisposer) {
      this.watchDisposer();
      this.watchDisposer = undefined;
    }

    if (!this.filePath) {
      return;
    }
    const filePath = this.filePath;

    const watcher = chokidar.watch(filePath);
    watcher.on("change", () => {
      try {
        const json = ProjectJSON.parse(
          JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }))
        );
        if (isEqual(json, this._data)) {
          return;
        }
        if (this.edited) {
          // TODO: warn
          return;
        }
        this._data = json;
        this.savedData = json;
        this.emit("dataChange", json);
      } catch (e) {
        console.error(e);
      }
    });
    this.watchDisposer = () => {
      void watcher.close();
    };
  }
  private watchDisposer?: () => void;
}

function formatJSON(text: string): string {
  return prettier.format(text, {
    parser: "json",
    plugins: [parserBabel],
  });
}
