import * as vscode from "vscode";
import { UIMixDocument } from "./UIMixDocument";
import { ProjectFiles } from "uimix/src/compiler/ProjectFiles";

export class UIMixEditorProvider implements vscode.CustomEditorProvider {
  constructor(context: vscode.ExtensionContext) {
    this.context = context;

    const rootFolder = vscode.workspace.workspaceFolders?.[0];
    if (!rootFolder) {
      throw new Error("No workspace folder found");
    }

    this.projectFiles = new ProjectFiles(rootFolder.uri.fsPath);
    console.log(this.projectFiles.pages);
  }

  readonly context: vscode.ExtensionContext;
  readonly projectFiles: ProjectFiles;

  private readonly _onDidChangeCustomDocument =
    new vscode.EventEmitter<vscode.CustomDocumentContentChangeEvent>();

  readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

  async saveCustomDocument(
    document: vscode.CustomDocument,
    cancellation: vscode.CancellationToken
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async saveCustomDocumentAs(
    document: vscode.CustomDocument,
    destination: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async revertCustomDocument(
    document: vscode.CustomDocument,
    cancellation: vscode.CancellationToken
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async backupCustomDocument(
    document: vscode.CustomDocument,
    context: vscode.CustomDocumentBackupContext,
    cancellation: vscode.CancellationToken
  ): Promise<vscode.CustomDocumentBackup> {
    throw new Error("Method not implemented.");
  }

  async openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ): Promise<vscode.CustomDocument> {
    return new UIMixDocument(uri);
  }

  async resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
