import { ProjectFiles } from "uimix/src/project/ProjectFiles";
import { getPageID } from "@uimix/model/src/models/ProjectJSON";
import * as vscode from "vscode";
import * as path from "path";

export class CustomDocument implements vscode.CustomDocument {
  constructor(projectFiles: ProjectFiles, uri: vscode.Uri) {
    this.projectFiles = projectFiles;
    this.uri = uri;
  }

  readonly projectFiles: ProjectFiles;
  readonly uri: vscode.Uri;

  get pageID(): string {
    // Important TODO: fix paths in Windows!!
    const relativePath = path.relative(
      this.projectFiles.rootPath,
      this.uri.fsPath
    );
    return getPageID(relativePath.replace(/\.uimix$/, ""));
  }

  dispose(): void {}
}
