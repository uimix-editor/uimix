import * as vscode from "vscode";
import { CustomDocument } from "./CustomDocument";
import { ProjectFiles } from "uimix/src/project/ProjectFiles";
import * as Y from "yjs";
import { ProjectData } from "@uimix/editor/src/models/ProjectData";
import {
  IEditorToVSCodeRPCHandler,
  IVSCodeToEditorRPCHandler,
} from "../../dashboard/src/types/VSCodeEditorRPC";
import { RPC } from "@uimix/typed-rpc";
import debounce from "just-debounce-it";

function getNonce(): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export class CustomEditorProvider implements vscode.CustomEditorProvider {
  constructor(context: vscode.ExtensionContext) {
    this.context = context;

    const rootFolder = vscode.workspace.workspaceFolders?.[0];
    if (!rootFolder) {
      throw new Error("No workspace folder found");
    }

    console.log(rootFolder.uri.fsPath);
    this.projectFiles = new ProjectFiles(rootFolder.uri.fsPath);
    this.projectFiles.load();

    this.data.loadJSON(this.projectFiles.json);

    this.disposables.push({
      dispose: this.projectFiles.watch((json) => {
        this.data.loadJSON(json);
      }),
    });
  }

  readonly context: vscode.ExtensionContext;
  readonly projectFiles: ProjectFiles;
  readonly data = new ProjectData();

  private readonly _onDidChangeCustomDocument =
    new vscode.EventEmitter<vscode.CustomDocumentContentChangeEvent>();

  readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

  readonly disposables: vscode.Disposable[] = [];

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
    return new CustomDocument(this.projectFiles, uri);
  }

  async resolveCustomEditor(
    document: CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHTMLForWebview(webviewPanel.webview);

    let unsubscribeDoc: (() => void) | undefined;

    const rpc = new RPC<IVSCodeToEditorRPCHandler, IEditorToVSCodeRPCHandler>(
      {
        post: (message) => {
          webviewPanel.webview.postMessage(message);
        },
        subscribe: (handler) => {
          const disposable = webviewPanel.webview.onDidReceiveMessage(handler);
          return () => disposable.dispose();
        },
      },
      {
        ready: async () => {
          const onDocUpdate = (update: Uint8Array) => rpc.remote.update(update);
          this.data.doc.on("update", onDocUpdate);
          unsubscribeDoc = () => this.data.doc.off("update", onDocUpdate);

          void rpc.remote.init(
            Y.encodeStateAsUpdate(this.data.doc),
            document.pageID
          );

          console.log("ready");
        },
        update: async (data) => {
          console.log("sync", data);
          Y.applyUpdate(this.data.doc, data);
          this.save();
        },
      }
    );

    webviewPanel.onDidDispose(() => {
      rpc.dispose();
      unsubscribeDoc?.();
    });
  }

  readonly save = debounce(() => {
    this.projectFiles.json = this.data.toJSON();
    this.projectFiles.save();
  }, 500);

  private getHTMLForWebview(webview: vscode.Webview): string {
    const nonce = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src *; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style nonce="${nonce}">
          body {
            margin: 0;
          }
          iframe {
            border: none;
            position: fixed;
            inset: 0;
            width: 100vw;
            height: 100vh;
          }
        </style>
      </head>
      <body>
      <iframe src="http://localhost:3000/vscode-editor" allow="clipboard-read; clipboard-write"></iframe>
      <script nonce="${nonce}">
        // pass-through messages between the iframe and the extension
        const vscode = acquireVsCodeApi();
        const iframe = document.querySelector("iframe");

        window.addEventListener("message", (event) => {
          if (event.source === iframe.contentWindow) {
            vscode.postMessage(event.data);
          } else {
            iframe.contentWindow.postMessage(event.data, "*");
          }
        });
      </script>
      </body>
      </html>
    `;
  }
}
