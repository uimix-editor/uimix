import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { TypedEmitter } from "tiny-typed-emitter";
import { iframeTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import type {
  IRootToEditorRPCHandler,
  IEditorToRootRPCHandler,
} from "@uimix/editor/src/state/IFrameRPC";
import { LoadingErrorOverlay } from "./LoadingErrorOverlay";
import { assertNonNull } from "../../utils/assertNonNull";

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
          if (this.fileReady) {
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
      }
    );
  }

  private rpc: RPC<IRootToEditorRPCHandler, IEditorToRootRPCHandler>;
  private iframe: HTMLIFrameElement;
  private doc = new Y.Doc();
  private fileReady = true;
  private iframeReady = false;

  dispose() {
    this.rpc.dispose();
  }

  private onReady = async () => {
    this.doc.on("update", (update) => {
      void this.rpc.remote.sync(update as never);
    });
    await this.rpc.remote.init(Y.encodeStateAsUpdate(this.doc));
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
    ) + "?remSize=12&fontSize=11";

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
