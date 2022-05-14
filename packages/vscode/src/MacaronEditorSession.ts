import * as path from "path";
import * as vscode from "vscode";
import * as Comlink from "comlink";
//import type { API } from "../../editor/src/vscode/API";
import { MacaronEditorDocument } from "./MacaronEditorDocument";
import { IExtensionAPI, IWebviewAPI } from "./APIInterface";
import { Project } from "./Project";
import { getImportPath } from "./util";

function getNonce(): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export class MacaronEditorSession {
  private context: vscode.ExtensionContext;
  private document: MacaronEditorDocument;
  private webviewPanel: vscode.WebviewPanel;
  private disposables: vscode.Disposable[] = [];
  private webviewAPI: Comlink.Remote<IWebviewAPI> | undefined;
  private fileWatcher: vscode.FileSystemWatcher;

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
    document.session = this;
    this.webviewPanel = webviewPanel;

    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHTMLForWebview(webviewPanel.webview);

    void this.setupComlink();

    const parent = path.dirname(this.document.uri.path);
    const name = path.basename(this.document.uri.path);

    this.fileWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(vscode.Uri.file(parent), name)
    );

    this.disposables.push(
      this.fileWatcher.onDidChange(async () => {
        const data = await vscode.workspace.fs.readFile(document.uri);
        const content = Buffer.from(data).toString();
        await this.webviewAPI?.setContent(
          content,
          this.document.serverUri?.toString()
        );
      })
    );
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

    this.webviewAPI = Comlink.wrap<IWebviewAPI>(comlinkEndpoint);

    if (Project.instance.imagesWatcher) {
      this.disposables.push(
        Project.instance.imagesWatcher.onChange((images) => {
          void this.webviewAPI?.setImageAssets(this.getImageFiles(images));
        })
      );
      await this.webviewAPI?.setImageAssets(
        this.getImageFiles(Project.instance.imagesWatcher.paths)
      );
    }

    await this.webviewAPI.setContent(
      this.document.initialContent,
      this.document.serverUri?.toString()
    );
  }

  dispose(): void {
    this.disposables.forEach((disposer) => void disposer.dispose());
  }

  private getHTMLForWebview(webview: vscode.Webview): string {
    // TODO: production

    const nonce = getNonce();

    const fileServerOrigin = Project.instance.fileServer?.origin ?? "";

    const csp = `
      default-src 'none';
      connect-src ${webview.cspSource} data: ws://localhost:3000;
      img-src ${webview.cspSource} ${fileServerOrigin} data: blob:;
      font-src https://fonts.gstatic.com;
      style-src ${webview.cspSource} https://fonts.googleapis.com 'unsafe-inline';
      script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic';
      frame-src blob:;
    `;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="${csp}">
      </head>
      <body>
        <div id="root"></div>
        <script nonce="${nonce}" type="module">
          import RefreshRuntime from "http://localhost:3000/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        </script>
        <script nonce="${nonce}" type="module" src="http://localhost:3000/@vite/client"></script>
        <script nonce="${nonce}" type="module" src="http://localhost:3000/src/vscode/main.tsx"></script>
      </body>
      </html>`;
  }

  private getImageFiles(imageFilePaths: Set<string>): string[] {
    return [...imageFilePaths]
      .sort()
      .map((filePath) => getImportPath(this.document.uri.path, filePath));
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
    const content =
      (await this.webviewAPI?.getContent()) || this.document.initialContent;
    await vscode.workspace.fs.writeFile(targetResource, Buffer.from(content));
    if (updateSavePoint) {
      await this.webviewAPI?.updateSavePoint();
    }
  }

  async save(cancellation?: vscode.CancellationToken): Promise<void> {
    await this.saveAs(this.document.uri, cancellation, true);
    this.document.isRestoredFromBackup = false;
  }

  async backup(
    destination: vscode.Uri,
    cancellation?: vscode.CancellationToken
  ): Promise<vscode.CustomDocumentBackup> {
    await this.saveAs(destination, cancellation, false);

    return {
      id: destination.toString(),
      delete: async () => {
        try {
          await vscode.workspace.fs.delete(destination);
        } catch {
          // noop
        }
      },
    };
  }
}
