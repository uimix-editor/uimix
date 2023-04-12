import path from "path";
import { ProjectJSON } from "../../model/src/data/v1";
import { compareProjectJSONs } from "../../model/src/data/util";
import { DocumentMetadata } from "../../dashboard/src/types/DesktopAPI";
import { TypedEmitter } from "tiny-typed-emitter";
import { app, dialog } from "electron";
import { WorkspaceLoader } from "../../cli/src/project/WorkspaceLoader";
import { NodeFileAccess } from "../../cli/src/project/NodeFileAccess";

export class File extends TypedEmitter<{
  editedChange: (edited: boolean) => void;
  metadataChange: (metadata: DocumentMetadata) => void;
  dataChange: (data: ProjectJSON) => void;
}> {
  constructor(loader?: WorkspaceLoader) {
    super();

    if (loader) {
      app.addRecentDocument(loader.rootPath);
      this.loader = loader;
    }

    this._data = this.loader?.json ?? {
      // default project
      nodes: {
        project: { type: "project", index: 0 },
      },
      styles: {},
    };
    this.savedData = this._data;
    if (loader) {
      this.watch();
    }
  }

  get name(): string {
    return this.loader
      ? path.basename(this.loader.rootPath)
      : "Untitled Project";
  }

  get filePath(): string | undefined {
    return this.loader?.rootPath;
  }

  get metadata(): DocumentMetadata {
    return {
      name: this.name,
    };
  }

  loader?: WorkspaceLoader;
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
    if (!this.loader) {
      await this.saveAs();
      return;
    }

    this.loader.json = this.data;
    await this.loader.save();
    app.addRecentDocument(this.loader.rootPath);
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

    this.loader = new WorkspaceLoader(new NodeFileAccess(newPath));
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
    const loader = await WorkspaceLoader.load(new NodeFileAccess(filePath));
    return new File(loader);
  }

  watch() {
    if (this.watchDisposer) {
      this.watchDisposer();
      this.watchDisposer = undefined;
    }

    const { loader } = this;
    if (!loader) {
      return;
    }

    this.watchDisposer = loader.watch(() => {
      const json = loader.json;
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
