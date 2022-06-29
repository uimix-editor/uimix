import * as vscode from "vscode";
import { AssetServer } from "./AssetServer";
import { ImagesWatcher } from "./ImagesWatcher";

export class Project {
  constructor() {
    this.rootFolder = vscode.workspace.workspaceFolders?.[0];
    if (this.rootFolder) {
      this.imagesWatcher = new ImagesWatcher(this.rootFolder.uri);
      this.assetServer = new AssetServer(this.rootFolder.uri);
    }
  }
  readonly rootFolder: vscode.WorkspaceFolder | undefined;
  readonly imagesWatcher: ImagesWatcher | undefined;
  readonly assetServer: AssetServer | undefined;

  static readonly instance = new Project();
}
