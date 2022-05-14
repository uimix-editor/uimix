import * as vscode from "vscode";
import { FileServer } from "./FileServer";
import { ImagesWatcher } from "./ImagesWatcher";

export class Project {
  constructor() {
    this.rootFolder = vscode.workspace.workspaceFolders?.[0];
    if (this.rootFolder) {
      this.imagesWatcher = new ImagesWatcher(this.rootFolder.uri);
      this.fileServer = new FileServer(this.rootFolder.uri);
    }
  }
  readonly rootFolder: vscode.WorkspaceFolder | undefined;
  readonly imagesWatcher: ImagesWatcher | undefined;
  readonly fileServer: FileServer | undefined;

  static readonly instance = new Project();
}
