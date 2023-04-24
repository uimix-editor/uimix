import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { TypedEmitter } from "tiny-typed-emitter";
import { iframeTarget, parentWindowTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import type {
  IRootToEditorRPCHandler,
  IEditorToRootRPCHandler,
} from "@uimix/editor/src/types/IFrameRPC";
import { LoadingErrorOverlay } from "./LoadingErrorOverlay";
import { assertNonNull } from "../../utils/assertNonNull";
import {
  IEditorToVSCodeRPCHandler,
  IVSCodeToEditorRPCHandler,
} from "../../types/VSCodeEditorRPC";

// TODO: test

class Connection extends TypedEmitter<{
  readyToShow(): void;
}> {
  constructor(iframe: HTMLIFrameElement) {
    super();
    this.iframe = iframe;
    this.rpc = new RPC<IRootToEditorRPCHandler, IEditorToRootRPCHandler>(
      iframeTarget(iframe),
      {
        ready: async () => {
          this.iframeReady = true;
          if (this.vscodeReady) {
            await this.onReady();
          }
        },
        update: async (data: Uint8Array) => {
          Y.applyUpdate(this.doc, data);
          // TODO
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
        getClipboard: async (type) => {
          // Propagate to vscode webview
          // there's a bug in vscode that prevents navigator.clipboard.readText() from working in inner iframes
          // https://github.com/microsoft/vscode/issues/129178#issuecomment-913093082
          return await this.vscodeRPC.remote.getClipboard(type);
        },
        setClipboard: async (type, text) => {
          await this.vscodeRPC.remote.setClipboard(type, text);
        },

        getCodeAssets: async () => {
          return this.vscodeRPC.remote.getCodeAssets();
        },
      }
    );

    this.vscodeRPC = new RPC<
      IEditorToVSCodeRPCHandler,
      IVSCodeToEditorRPCHandler
    >(parentWindowTarget(), {
      init: async (update, pageID) => {
        Y.applyUpdate(this.doc, update);
        this.pageID = pageID;
        this.vscodeReady = true;
        if (this.iframeReady) {
          await this.onReady();
        }
      },
      update: async (update) => {
        Y.applyUpdate(this.doc, update);
      },
      updateCodeAssets: async (assets) => {
        await this.rpc.remote.updateCodeAssets(assets);
      },
    });
    this.doc.on("update", (update: Uint8Array) => {
      void this.vscodeRPC.remote.update(update);
    });
    void this.vscodeRPC.remote.ready();
  }

  private rpc: RPC<IRootToEditorRPCHandler, IEditorToRootRPCHandler>;
  private vscodeRPC: RPC<IEditorToVSCodeRPCHandler, IVSCodeToEditorRPCHandler>;
  private iframe: HTMLIFrameElement;
  private doc = new Y.Doc();
  private vscodeReady = false;
  private iframeReady = false;
  private pageID: string | undefined;

  dispose() {
    this.rpc.dispose();
  }

  private onReady = async () => {
    this.doc.on("update", (update) => {
      void this.rpc.remote.update(update as never);
    });
    await this.rpc.remote.init(Y.encodeStateAsUpdate(this.doc), this.pageID);
    this.emit("readyToShow");
  };
}

const VSCodeEditor: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }
    const connection = new Connection(iframe);
    connection.on("readyToShow", () => {
      setLoading(false);
    });
    return () => connection.dispose();
  }, []);

  const editorSrc =
    assertNonNull(process.env.NEXT_PUBLIC_EDITOR_URL).replace(
      "://",
      // TODO: use unique ID for subdomain?
      `://local.`
    ) + "?embed=true&uiScaling=0.75&fontSize=11&narrowMode=true";

  return (
    <div className="text-neutral-800 text-xs">
      <iframe
        ref={iframeRef}
        // looks like Chrome sends wrong coordinates in pointerrawupdate events inside iframes (TODO: report)
        // place the iframe full screen to avoid this
        className="fixed inset-0 w-full h-full"
        src={editorSrc}
        allow="clipboard-read; clipboard-write"
      />
      {loading && <LoadingErrorOverlay isError={false} />}
    </div>
  );
};

export default VSCodeEditor;
