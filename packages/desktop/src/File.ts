import path from "path";
import { ProjectJSON } from "../../node-data/src";
import { DocumentMetadata } from "../../dashboard/src/types/DesktopAPI";
import { TypedEmitter } from "tiny-typed-emitter";
import { app, dialog } from "electron";
import { isEqual } from "lodash";
import { ProjectFiles } from "../../cli/src/compiler/ProjectFiles";

export function compareProjectJSONs(a: ProjectJSON, b: ProjectJSON): boolean {
  return (
    JSON.stringify(a.nodes) === JSON.stringify(b.nodes) &&
    JSON.stringify(a.styles) === JSON.stringify(b.styles) &&
    JSON.stringify(a.componentURLs) === JSON.stringify(b.componentURLs) &&
    JSON.stringify(a.colors) === JSON.stringify(b.colors)
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

    if (filePath) {
      app.addRecentDocument(filePath);
      this.files = new ProjectFiles(filePath);
      this.files.load();
    }

    this._data = this.files?.projectJSON ?? {
      // default project
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
    return this.files ? path.basename(this.files.rootPath) : "Untitled Project";
  }

  get filePath(): string | undefined {
    return this.files?.rootPath;
  }

  get metadata(): DocumentMetadata {
    return {
      name: this.name,
    };
  }

  files?: ProjectFiles;
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
    if (!this.files) {
      this.saveAs();
      return;
    }

    this.files.projectJSON = this.data;
    this.files.save();
    app.addRecentDocument(this.files.rootPath);
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

    this.files = new ProjectFiles(newPath);
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

    const { files } = this;
    if (!files) {
      return;
    }

    this.watchDisposer = files.watch(() => {
      const json = files.projectJSON;
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
    });
  }
  private watchDisposer?: () => void;
}
