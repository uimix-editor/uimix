import * as vscode from "vscode";
import { MacaronEditorSession } from "./MacaronEditorSession";

export class MacaronEditorDocument implements vscode.CustomDocument {
  static async create(
    uri: vscode.Uri,
    backupId: string | undefined
  ): Promise<MacaronEditorDocument> {
    // If we have a backup, read that. Otherwise read the resource from the workspace
    const dataFile =
      typeof backupId === "string" ? vscode.Uri.parse(backupId) : uri;
    const fileData = await this.readFile(dataFile);
    return new MacaronEditorDocument(
      uri,
      fileData,
      typeof backupId === "string"
    );
  }

  private static async readFile(uri: vscode.Uri): Promise<string> {
    if (uri.scheme === "untitled") {
      return "";
    }

    const data = await vscode.workspace.fs.readFile(uri);
    return Buffer.from(data).toString();
  }

  readonly uri: vscode.Uri;
  content: string;
  isRestoredFromBackup: boolean;
  session?: MacaronEditorSession;

  private constructor(
    uri: vscode.Uri,
    initialContent: string,
    isRestoredFromBackup: boolean
  ) {
    this.uri = uri;
    this.content = initialContent;
    this.isRestoredFromBackup = isRestoredFromBackup;
  }

  dispose(): void {}
}
