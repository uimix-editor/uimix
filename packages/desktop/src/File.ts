import path from "path";
import * as Data from "../../model/src/data/v1";
import { compareProjectJSONs } from "../../model/src/data/util";
import { DocumentMetadata } from "../../dashboard/src/types/DesktopAPI";
import { TypedEmitter } from "tiny-typed-emitter";
import { app, dialog } from "electron";
import { WorkspaceIO } from "../../cli/src/project/WorkspaceIO";
import { NodeFileAccess } from "../../cli/src/project/NodeFileAccess";

export class File extends TypedEmitter<{
  editedChange: (edited: boolean) => void;
  metadataChange: (metadata: DocumentMetadata) => void;
  dataChange: (data: Data.Project) => void;
}> {
  constructor(workspaceIO?: WorkspaceIO) {
    super();

    if (workspaceIO) {
      app.addRecentDocument(workspaceIO.rootPath);
      this.workspaceIO = workspaceIO;
    }

    this._data = this.workspaceIO?.rootProject.project.toJSON() ?? {
      // default project
      nodes: {
        project: { type: "project", index: 0 },
      },
      styles: {},
      componentURLs: [],
      images: {},
      colors: {},
    };
    this.savedData = this._data;
    if (workspaceIO) {
      this.watch();
    }
  }

  get name(): string {
    return this.workspaceIO
      ? path.basename(this.workspaceIO.rootPath)
      : "Untitled Project";
  }

  get filePath(): string | undefined {
    return this.workspaceIO?.rootPath;
  }

  get metadata(): DocumentMetadata {
    return {
      name: this.name,
    };
  }

  workspaceIO?: WorkspaceIO;
  edited = false;

  private _data: Data.Project;
  get data(): Data.Project {
    return this._data;
  }
  setData(data: Data.Project) {
    this._data = data;
    this.edited = !compareProjectJSONs(this.savedData, this._data);
    this.emit("editedChange", this.edited);
  }

  private savedData: Data.Project;

  revert() {
    this.setData(this.savedData);
    this.emit("dataChange", this.data);
  }

  async save() {
    if (!this.workspaceIO) {
      await this.saveAs();
      return;
    }

    this.workspaceIO.rootProject.project.loadJSON(this.data);
    await this.workspaceIO.save();
    app.addRecentDocument(this.workspaceIO.rootPath);
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

    this.workspaceIO = new WorkspaceIO(new NodeFileAccess(newPath));
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
    const workspaceIO = await WorkspaceIO.load(new NodeFileAccess(filePath));
    return new File(workspaceIO);
  }

  watch() {
    if (this.watchDisposer) {
      this.watchDisposer();
      this.watchDisposer = undefined;
    }

    const { workspaceIO: loader } = this;
    if (!loader) {
      return;
    }

    this.watchDisposer = loader.watch(() => {
      const json = loader.rootProject.project.toJSON();
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
