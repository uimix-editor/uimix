import path from "path";
import { ProjectJSON } from "../../node-data/src";
import { DocumentMetadata } from "../../dashboard/src/types/DesktopAPI";
import { TypedEmitter } from "tiny-typed-emitter";
import { app, dialog } from "electron";
import { ProjectFiles } from "../../cli/src/project/ProjectFiles";
import { NodeFileAccess } from "../../cli/src/project/NodeFileAccess";
import { compareProjectJSONs } from "../../editor/src/models/ProjectJSON";

export class File extends TypedEmitter<{
  editedChange: (edited: boolean) => void;
  metadataChange: (metadata: DocumentMetadata) => void;
  dataChange: (data: ProjectJSON) => void;
}> {
  constructor(files?: ProjectFiles) {
    super();

    if (files) {
      app.addRecentDocument(files.rootPath);
      this.files = files;
    }

    this._data = this.files?.json ?? {
      // default project
      nodes: {
        project: { type: "project", index: 0 },
      },
      styles: {},
    };
    this.savedData = this._data;
    if (files) {
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

  async save() {
    if (!this.files) {
      await this.saveAs();
      return;
    }

    this.files.json = this.data;
    await this.files.save();
    app.addRecentDocument(this.files.rootPath);
    this.savedData = this.data;
    this.edited = false;
    this.emit("editedChange", this.edited);
  }

  async saveAs() {
    const openDialogResult = await dialog.showOpenDialog({
      properties: ["openDirectory", "createDirectory"],
      message: "Select a folder to save your project to.",
    });
    const newPath = openDialogResult.filePaths[0];
    if (!newPath) {
      return;
    }
    console.log("newPath", newPath);

    this.files = new ProjectFiles(new NodeFileAccess(newPath));
    await this.save();
    this.watch();

    this.emit("metadataChange", this.metadata);
  }

  static async open() {
    const dialogResult = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      message: "Select a folder to open your project from.",
    });
    const filePath = dialogResult.filePaths[0];
    if (!filePath) {
      return;
    }

    return await this.openFilePath(filePath);
  }

  static async openFilePath(filePath: string) {
    const files = await ProjectFiles.load(new NodeFileAccess(filePath));
    return new File(files);
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
      const json = files.json;
      console.log("changed");
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
