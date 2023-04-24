import * as vscode from "vscode";
import { CustomDocument } from "./CustomDocument";
import { WorkspaceAdapter } from "./WorkspaceAdapter";

export class CustomEditorProvider implements vscode.CustomEditorProvider {
  static async load(context: vscode.ExtensionContext) {
    const rootFolder = vscode.workspace.workspaceFolders?.[0];
    if (!rootFolder) {
      throw new Error("No workspace folder found");
    }
    return new CustomEditorProvider(context, new WorkspaceAdapter(rootFolder));
  }

  constructor(
    context: vscode.ExtensionContext,
    workspaceAdapter: WorkspaceAdapter
  ) {
    this.context = context;
    this.workspaceAdapter = workspaceAdapter;
    this.disposables.push(workspaceAdapter);
  }

  readonly disposables: vscode.Disposable[] = [];
  readonly context: vscode.ExtensionContext;
  readonly workspaceAdapter: WorkspaceAdapter;
  private readonly _onDidChangeCustomDocument =
    new vscode.EventEmitter<vscode.CustomDocumentContentChangeEvent>();

  readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

  dispose() {
    this.disposables.forEach((disposable) => disposable.dispose());
  }

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
    return new CustomDocument(this.context, this.workspaceAdapter, uri);
  }

  async resolveCustomEditor(
    document: CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    await document.resolveCustomEditor(webviewPanel, token);
  }
}
