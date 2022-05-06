import * as vscode from "vscode";
import * as Comlink from "comlink";
//import type { API } from "../../editor/src/vscode/API";
import { MacaronEditorDocument } from "./MacaronEditorDocument";
import { APIInterface } from "./APIInterface";

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

    const api = Comlink.wrap<APIInterface>({
      addEventListener: (
        type: string,
        listener: (evt: Event) => void,
        options?: {}
      ) => {
        webviewPanel.webview.onDidReceiveMessage(listener);
      },
      removeEventListener: (
        type: string,
        listener: (evt: Event) => void,
        options?: {}
      ) => {
        // TODO
      },
      postMessage: (message: any) => {
        webviewPanel.webview.postMessage(message);
      },
    });
    api.updateSavePoint();

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
        <script type="module">
          import RefreshRuntime from "http://localhost:3000/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        </script>
        <script type="module" src="http://localhost:3000/@vite/client"></script>
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
