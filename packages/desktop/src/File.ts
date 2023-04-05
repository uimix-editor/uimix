import path from "path";
import { ProjectJSON } from "../../node-data/src";
import { DocumentMetadata } from "../../dashboard/src/types/DesktopAPI";
import { TypedEmitter } from "tiny-typed-emitter";
import { app, dialog } from "electron";
import { isEqual } from "lodash";
import chokidar from "chokidar";
import {
  loadProjectFromDirectory,
  saveProjectToDirectory,
  filesToProjectJSON,
  projectJSONToFiles,
} from "../../cli/src/compiler/project";

export function compareProjectJSONs(a: ProjectJSON, b: ProjectJSON): boolean {
  return (
    JSON.stringify(a.nodes) === JSON.stringify(b.nodes) &&
    JSON.stringify(a.styles) === JSON.stringify(b.styles) &&
    JSON.stringify(a.componentURLs) === JSON.stringify(b.componentURLs)
    // do not compare images because they are too big
  );
}

export class File extends TypedEmitter<{
  editedChange: (edited: boolean) => void;
  metadataChange: (metadata: DocumentMetadata) => void;
  dataChange: (data: ProjectJSON) => void;
}> {
  constructor(filePath?: string) {
    super();

    this.filePath = filePath;
    if (filePath) {
      app.addRecentDocument(filePath);
    }
    this._data = filePath
      ? filesToProjectJSON(loadProjectFromDirectory(filePath))
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
    return this.filePath ? path.basename(this.filePath) : "Untitled Project";
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
    this.edited = !compareProjectJSONs(this.savedData, this._data);
    this.emit("editedChange", this.edited);
  }

  private savedData: ProjectJSON;

  revert() {
    this.setData(this.savedData);
    this.emit("dataChange", this.data);
  }

  save() {
    if (!this.filePath) {
      this.saveAs();
      return;
    }

    saveProjectToDirectory(this.filePath, projectJSONToFiles(this.data));
    app.addRecentDocument(this.filePath);
    this.savedData = this.data;
    this.edited = false;
    this.emit("editedChange", this.edited);
  }

  saveAs() {
    const newPath = dialog.showOpenDialogSync({
      properties: ["openDirectory", "createDirectory"],
      message: "Select a folder to save your project to.",
    })?.[0];
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
      properties: ["openDirectory"],
      message: "Select a folder to open your project from.",
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
    const watchPath = path.resolve(filePath, "**/*.uimix");

    // FIXME: chokidar looks like making UI slow
    const watcher = chokidar.watch(watchPath);
    console.log("start watching...");

    const onChange = () => {
      try {
        const json = filesToProjectJSON(loadProjectFromDirectory(filePath));
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
    };

    watcher.on("change", onChange);
    watcher.on("add", onChange);
    watcher.on("unlink", onChange);

    this.watchDisposer = () => {
      void watcher.close();
    };
  }
  private watchDisposer?: () => void;
}
