import * as vscode from "vscode";
import { MacaronEditorDocument } from "./MacaronEditorDocument";

export class MacaronEditorSession {
  private static instanceForPath = new Map<string, MacaronEditorSession>();

  static instanceForUri(uri: vscode.Uri): MacaronEditorSession | undefined {
    return this.instanceForPath.get(uri.path);
  }

  private context: vscode.ExtensionContext;
  private document: MacaronEditorDocument;
  private webviewPanel: vscode.WebviewPanel;
  private disposables: vscode.Disposable[] = [];

  private readonly _onDidChange =
    new vscode.EventEmitter<vscode.CustomDocumentContentChangeEvent>();

  readonly onDidChange = this._onDidChange.event;

  constructor(
    context: vscode.ExtensionContext,
    document: MacaronEditorDocument,
    webviewPanel: vscode.WebviewPanel
  ) {
    this.context = context;
    this.document = document;
    this.webviewPanel = webviewPanel;

    MacaronEditorSession.instanceForPath.set(document.uri.path, this);

    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHTMLForWebview(webviewPanel.webview);

    // TODO: connect to the webview
  }

  dispose(): void {
    MacaronEditorSession.instanceForPath.delete(this.document.uri.path);
    this.disposables.forEach((disposer) => void disposer.dispose());
  }

  private getHTMLForWebview(webview: vscode.Webview): string {
    // TODO: production

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="http://localhost:3000/src/vscode/main.tsx"></script>
      </body>
      </html>`;
  }

  async saveAs(
    targetResource: vscode.Uri,
    cancellation?: vscode.CancellationToken,
    updateSavePoint = false
  ): Promise<void> {
    throw new Error("TODO");
  }

  async save(cancellation?: vscode.CancellationToken): Promise<void> {
    throw new Error("TODO");
  }

  async backup(
    destination: vscode.Uri,
    cancellation?: vscode.CancellationToken
  ): Promise<vscode.CustomDocumentBackup> {
    throw new Error("TODO");
  }
}
