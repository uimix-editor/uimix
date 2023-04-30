import * as vscode from "vscode";
import { RPC } from "@uimix/typed-rpc";
import * as Y from "yjs";
import debounce from "just-debounce-it";
import path from "path";
import { codeAssetsDestination } from "uimix/src/codeAssets/constants";
import { CodeAssets } from "@uimix/model/src/models/CodeAssets";
import { getPageID } from "@uimix/model/src/data/util";
import { ProjectIO } from "uimix/src/project/ProjectIO";
import { CustomDocument } from "./CustomDocument";
import type {
  IRootToEditorRPCHandler,
  IEditorToRootRPCHandler,
} from "@uimix/editor/src/types/IFrameRPC";
import fetch from "node-fetch";

const debouncedUpdate = (
  onUpdate: (update: Uint8Array) => void
): ((update: Uint8Array) => void) => {
  const updates: Uint8Array[] = [];
  let queued = false;
  const debounced = (update: Uint8Array) => {
    updates.push(update);
    if (queued) {
      return;
    }
    queued = true;
    queueMicrotask(() => {
      queued = false;
      if (updates.length) {
        onUpdate(Y.mergeUpdates(updates));
        updates.length = 0;
      }
    });
  };
  return debounced;
};

export class EditorSession {
  constructor(customDocument: CustomDocument, projectIO: ProjectIO) {
    this.customDocument = customDocument;
    this.projectIO = projectIO;
  }

  readonly customDocument: CustomDocument;
  readonly projectIO: ProjectIO;

  async resolveCustomEditor(
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = await this.getHTMLForWebview(
      webviewPanel.webview
    );

    const projectIO = this.projectIO;
    const uri = this.customDocument.uri;
    const workspaceAdapter = this.customDocument.workspaceAdapter;

    const relativePath = path.relative(projectIO.rootPath, uri.fsPath);
    const pageID = getPageID(relativePath.replace(/\.uimix$/, ""));

    const projectData = projectIO.content.project.data;

    let unsubscribeDoc: (() => void) | undefined;

    const rpc = new RPC<IRootToEditorRPCHandler, IEditorToRootRPCHandler>(
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

          const onDocUpdate = debouncedUpdate((update: Uint8Array) => {
            rpc.remote.update(update);
          });
          projectData.doc.on("update", onDocUpdate);
          unsubscribeDoc = () => projectData.doc.off("update", onDocUpdate);

          void rpc.remote.init(Y.encodeStateAsUpdate(projectData.doc), pageID);

          console.log("ready");
        },
        update: async (data) => {
          console.log("sync");
          Y.applyUpdate(projectData.doc, data);
          this.saveDebounced();
        },
        uploadImage: async (
          hash: string,
          contentType: string,
          data: Uint8Array
        ) => {
          // just return data url
          return `data:${contentType};base64,${Buffer.from(data).toString(
            "base64"
          )}`;
        },
        updateThumbnail: async () => {
          // no op
        },
        getCodeAssets: async () => this.loadCodeAssets(),
      }
    );

    const unsubscribeAssetChanges = workspaceAdapter.onDidChangeCodeAssets(
      async (projectPath) => {
        if (projectPath !== projectIO.rootPath) {
          return;
        }

        const codeAssets = await this.loadCodeAssets();
        if (codeAssets) {
          await rpc.remote.updateCodeAssets(codeAssets);
        }
      }
    );

    webviewPanel.onDidDispose(() => {
      rpc.dispose();
      unsubscribeDoc?.();
      unsubscribeAssetChanges.dispose();
    });
  }

  private readonly saveDebounced = debounce(async () => {
    try {
      await this.projectIO.save();
    } catch (e) {
      vscode.window.showErrorMessage(`Error saving project:\n${e}`);
    }
    console.log("save");
  }, 500);

  private async loadCodeAssets(): Promise<CodeAssets | undefined> {
    try {
      const assetURLs = [
        codeAssetsDestination.js,
        codeAssetsDestination.css,
      ].map((assetName) =>
        vscode.Uri.file(
          path.join(
            this.projectIO.rootPath,
            codeAssetsDestination.directory,
            assetName
          )
        )
      );

      const datas = await Promise.all(
        assetURLs.map((assetURL) => vscode.workspace.fs.readFile(assetURL))
      );
      const texts = datas.map((data) => Buffer.from(data).toString());

      return {
        js: texts[0],
        css: texts[1],
      };
    } catch {
      return undefined;
    }
  }

  private async getHTMLForWebview(webview: vscode.Webview): Promise<string> {
    const isDevelopment =
      this.customDocument.context.extensionMode ===
      vscode.ExtensionMode.Development;

    // TODO: CSP

    const configScript = `
<script>
  window.uimixViewOptions = {
    embed: true,
    uiScaling: 0.75,
    fontSize: 11,
    narrowMode: true,
    vscode: true,
  };
</script>`;

    if (!isDevelopment) {
      const remoteEditorURL = "https://local.editor.uimix.app";

      const html = await (await fetch(remoteEditorURL)).text();
      return html
        .replaceAll("</head>", configScript + "</head>")
        .replaceAll("/assets/", remoteEditorURL + "/assets/");
    }

    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
import RefreshRuntime from "http://localhost:5173/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>

    <script type="module" src="http://localhost:5173/@vite/client"></script>

    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UIMix Editor</title>
    ${configScript}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="http://localhost:5173/src/main.tsx"></script>
  </body>
</html>`;
  }
  /*
  private getHTMLForWebview(webview: vscode.Webview): string {
    const nonce = getNonce();

    const isDevelopment =
      this.customDocument.context.extensionMode ===
      vscode.ExtensionMode.Development;

    const iframeURL = isDevelopment
      ? "http://localhost:3000/vscode-editor"
      : "https://uimix.app/vscode-editor";

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src *; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}'; connect-src data:;">
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

        async function getClipboard(type) {
          switch (type) {
            case "text":
              return await navigator.clipboard.readText();
            case "image": {
              const items = await navigator.clipboard.read();
              const item = items.find((item) => item.types.includes("image/png"));
              if (!item) {
                return;
              }
              const blob = await item.getType("image/png");

              return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            }
          }
        }

        async function setClipboard(type, textOrDataURL) {
          switch (type) {
            case "text":
              await navigator.clipboard.writeText(textOrDataURL);
            case "image": {
              const blob = await fetch(textOrDataURL).then((r) => r.blob());
              await navigator.clipboard.write([
                new ClipboardItem({
                  "image/png": blob,
                }),
              ]);
            }
          }
        }

        window.addEventListener("message", async (event) => {
          if (event.source === iframe.contentWindow) {
            // intercept clipboard messages
            if (event.data.type === "call") {
              if (event.data.name === "getClipboard") {
                iframe.contentWindow.postMessage({
                  type: "result",
                  callID: event.data.callID,
                  status: "success",
                  value: await getClipboard(event.data.args[0]),
                }, "*");
                return;
              }
              if (event.data.name === "setClipboard") {
                await setClipboard(event.data.args[0], event.data.args[1]);
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
  */
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
