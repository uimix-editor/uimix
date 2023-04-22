import * as vscode from "vscode";
import { WorkspaceAdapter } from "./WorkspaceAdapter";
import { EditorSession } from "./EditorSession";

export class CustomDocument implements vscode.CustomDocument {
  constructor(
    context: vscode.ExtensionContext,
    workspaceAdapter: WorkspaceAdapter,
    uri: vscode.Uri
  ) {
    this.context = context;
    this.workspaceAdapter = workspaceAdapter;
    this.uri = uri;
  }

  readonly context: vscode.ExtensionContext;
  readonly workspaceAdapter: WorkspaceAdapter;
  readonly uri: vscode.Uri;

  dispose(): void {}

  async resolveCustomEditor(
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    const projectIO = await this.workspaceAdapter.getProjectIOForFile(this.uri);

    await new EditorSession(this, projectIO).resolveCustomEditor(
      webviewPanel,
      token
    );
  }
}
