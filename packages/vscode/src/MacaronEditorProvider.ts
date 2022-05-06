import * as vscode from "vscode";
import { MacaronEditorDocument } from "./MacaronEditorDocument";
import { MacaronEditorSession } from "./MacaronEditorSession";

export class MacaronEditorProvider implements vscode.CustomEditorProvider {
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  private readonly context: vscode.ExtensionContext;

  private readonly _onDidChangeCustomDocument =
    new vscode.EventEmitter<vscode.CustomDocumentContentChangeEvent>();

  readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

  async saveCustomDocument(
    document: vscode.CustomDocument,
    cancellation: vscode.CancellationToken
  ): Promise<void> {
    await (document as MacaronEditorDocument).session?.save(cancellation);
  }

  async saveCustomDocumentAs(
    document: vscode.CustomDocument,
    destination: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Promise<void> {
    await (document as MacaronEditorDocument).session?.saveAs(
      destination,
      cancellation
    );
  }

  async revertCustomDocument(
    document: vscode.CustomDocument,
    cancellation: vscode.CancellationToken
  ): Promise<void> {
    // TODO
  }

  async backupCustomDocument(
    document: vscode.CustomDocument,
    context: vscode.CustomDocumentBackupContext,
    cancellation: vscode.CancellationToken
  ): Promise<vscode.CustomDocumentBackup> {
    return (document as MacaronEditorDocument).session!.backup(
      context.destination,
      cancellation
    );
  }

  async openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ): Promise<vscode.CustomDocument> {
    return await MacaronEditorDocument.create(uri, openContext.backupId);
  }

  async resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    const session = new MacaronEditorSession(
      this.context,
      document as MacaronEditorDocument,
      webviewPanel
    );
    session.onDidChange((e) => {
      this._onDidChangeCustomDocument.fire(e);
    });

    webviewPanel.onDidDispose(() => session.dispose());
  }
}
