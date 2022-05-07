import * as vscode from "vscode";
import * as Comlink from "comlink";
//import type { API } from "../../editor/src/vscode/API";
import { MacaronEditorDocument } from "./MacaronEditorDocument";
import { IExtensionAPI, IWebviewAPI } from "./APIInterface";

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

    void this.setupComlink();
  }

  private async setupComlink() {
    await new Promise<void>((resolve) => {
      this.webviewPanel.webview.onDidReceiveMessage((msg) => {
        if (msg === "ready") {
          resolve();
        }
      });
    });

    const disposables = new WeakMap<(evt: Event) => void, vscode.Disposable>();

    const comlinkEndpoint: Comlink.Endpoint = {
      addEventListener: (
        type: string,
        listener: (evt: Event) => void,
        options?: {}
      ) => {
        const disposable = this.webviewPanel.webview.onDidReceiveMessage(
          (message) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            listener({ data: message });
          }
        );
        disposables.set(listener, disposable);
      },
      removeEventListener: (
        type: string,
        listener: (evt: Event) => void,
        options?: {}
      ) => {
        disposables.get(listener)?.dispose();
      },
      postMessage: (message: any) => {
        void this.webviewPanel.webview.postMessage(message);
      },
    };

    const extensionAPI: IExtensionAPI = {
      onDirtyChange: this.onDirtyChange.bind(this),
    };
    Comlink.expose(extensionAPI, comlinkEndpoint);

    const webviewAPI = Comlink.wrap<IWebviewAPI>(comlinkEndpoint);

    void webviewAPI.setContent(this.document.initialContent);

    // void webviewAPI.onDirtyChange(
    //   Comlink.proxy((dirty) => {
    //     console.log("dirty", dirty);
    //     if (dirty || this.document.isRestoredFromBackup) {
    //       this._onDidChange.fire({
    //         document: this.document,
    //       });
    //     } else {
    //       // FIXME: this is a workaround for clearing the dirty state
    //       void vscode.commands.executeCommand("workbench.action.files.revert");
    //     }
    //   })
    // );
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

  private onDirtyChange(dirty: boolean) {
    if (dirty || this.document.isRestoredFromBackup) {
      this._onDidChange.fire({
        document: this.document,
      });
    } else {
      // FIXME: this is a workaround for clearing the dirty state
      void vscode.commands.executeCommand("workbench.action.files.revert");
    }
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
