import * as vscode from "vscode";
import { WorkspaceData } from "./WorkspaceData";
import { ProjectData } from "@uimix/model/src/collaborative";
import {
  IEditorToVSCodeRPCHandler,
  IVSCodeToEditorRPCHandler,
} from "../../dashboard/src/types/VSCodeEditorRPC";
import { RPC } from "@uimix/typed-rpc";
import * as Y from "yjs";
import debounce from "just-debounce-it";

export class CustomDocument implements vscode.CustomDocument {
  constructor(
    context: vscode.ExtensionContext,
    workspaceData: WorkspaceData,
    uri: vscode.Uri
  ) {
    this.context = context;
    this.workspaceData = workspaceData;
    this.uri = uri;
  }

  readonly context: vscode.ExtensionContext;
  readonly workspaceData: WorkspaceData;
  readonly uri: vscode.Uri;

  get data(): ProjectData {
    return this.workspaceData.getDataForFile(this.uri);
  }

  get pageID(): string {
    return this.workspaceData.pageIDForFile(this.uri);
  }

  dispose(): void {}

  async resolveCustomEditor(
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHTMLForWebview(webviewPanel.webview);

    let unsubscribeDoc: (() => void) | undefined;

    const projectData = this.workspaceData.getDataForFile(this.uri);

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
          unsubscribeDoc?.();

          const onDocUpdate = (update: Uint8Array) => {
            rpc.remote.update(update);
          };
          projectData.doc.on("update", onDocUpdate);
          unsubscribeDoc = () => projectData.doc.off("update", onDocUpdate);

          void rpc.remote.init(
            Y.encodeStateAsUpdate(projectData.doc),
            this.pageID
          );

          console.log("ready");
        },
        update: async (data) => {
          console.log("sync");
          Y.applyUpdate(projectData.doc, data);
          this.saveDebounced();
        },
        getClipboard: async () => {
          throw new Error("should be intercepted in webview.");
        },
        setClipboard: async () => {
          throw new Error("should be intercepted in webview.");
        },
      }
    );

    webviewPanel.onDidDispose(() => {
      rpc.dispose();
      unsubscribeDoc?.();
    });
  }

  private readonly saveDebounced = debounce(() => {
    this.workspaceData.save(this.uri);
    console.log("save");
  }, 500);

  private getHTMLForWebview(webview: vscode.Webview): string {
    const nonce = getNonce();

    const isDevelopment =
      this.context.extensionMode === vscode.ExtensionMode.Development;

    const iframeURL = isDevelopment
      ? "http://localhost:3000/vscode-editor"
      : "https://uimix.app/vscode-editor";

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
      <iframe src="${iframeURL}" allow="clipboard-read; clipboard-write"></iframe>
      <script nonce="${nonce}">
        // pass-through messages between the iframe and the extension
        const vscode = acquireVsCodeApi();
        const iframe = document.querySelector("iframe");

        window.addEventListener("message", async (event) => {
          if (event.source === iframe.contentWindow) {
            // intercept clipboard messages
            if (event.data.type === "call") {
              if (event.data.name === "getClipboard") {
                const type = event.data.args[0];
                if (type !== "text") {
                  throw new Error("unsupported clipboard type: " + type);
                }

                iframe.contentWindow.postMessage({
                  type: "result",
                  callID: event.data.callID,
                  status: "success",
                  value: await navigator.clipboard.readText(),
                }, "*");
                return;
              }
              if (event.data.name === "setClipboard") {
                const type = event.data.args[0];
                if (type !== "text") {
                  throw new Error("unsupported clipboard type: " + type);
                }

                await navigator.clipboard.writeText(event.data.args[1]);
                iframe.contentWindow.postMessage({
                  type: "result",
                  callID: event.data.callID,
                  status: "success",
                  value: undefined,
                }, "*");
                return;
              }
            }
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

function getNonce(): string {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
