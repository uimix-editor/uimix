import { HocuspocusProvider } from "@hocuspocus/provider";
import React, { useEffect, useRef, useState } from "react";
import { dynamicTrpc } from "../utils/trpc";
import * as Y from "yjs";
import { TypedEmitter } from "tiny-typed-emitter";
import { rpcToIFrame } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import type {
  IRootToEditorRPCHandler,
  IEditorToRootRPCHandler,
} from "../../../editor/src/state/ProjectState";

class Connection extends TypedEmitter<{
  ready(): void;
}> {
  constructor(iframe: HTMLIFrameElement, documentId: string) {
    super();
    this.iframe = iframe;
    this.rpc = rpcToIFrame<IEditorToRootRPCHandler, IRootToEditorRPCHandler>(
      iframe,
      {
        ready: async () => {
          console.log("iframe:ready");
          this.iframeReady = true;
          if (this.hocuspocusReady) {
            this.emit("ready");
          }
        },
        update: async (data: Uint8Array) => {
          const doc = this.provider.document;
          console.log("uimix:update");
          Y.applyUpdate(doc, data);
          console.log(doc.getMap("project").toJSON());
        },
      }
    );

    this.provider = new HocuspocusProvider({
      url: "ws://localhost:1234",
      name: documentId,
      token: () => {
        return dynamicTrpc.collaborative.token.query();
      },
    });
    this.provider.on("connect", () => {
      if (this.hocuspocusReady) {
        return;
      }
      console.log("connected!");
      const data = this.provider.document.getMap("project");
      console.log(data.toJSON());
      this.hocuspocusReady = true;
      if (this.iframeReady) {
        console.log("emit ready");
        this.emit("ready");
      }
    });

    this.on("ready", this.onReady);
  }

  rpc: RPC<IEditorToRootRPCHandler, IRootToEditorRPCHandler>;

  dispose() {
    this.provider.disconnect();
    this.rpc.dispose();
  }

  onReady = () => {
    console.log("-- ready");

    const doc = this.provider.document;
    console.log(doc.getMap("project").toJSON());

    this.rpc.remote.init(Y.encodeStateAsUpdate(doc));
    doc.on("update", (update) => {
      this.rpc.remote.sync(update);
    });
  };

  iframe: HTMLIFrameElement;
  provider: HocuspocusProvider;
  hocuspocusReady = false;
  iframeReady = false;
}

const Editor: React.FC<{
  documentId: string;
}> = ({ documentId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }
    const connection = new Connection(iframe, documentId);
    connection.on("ready", () => {
      setLoading(false);
    });
    return () => connection.dispose();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full">
      <iframe
        ref={iframeRef}
        className="fixed inset-0 w-full h-full"
        src="http://randomvalue.editor.localhost:5173"
        allow="clipboard-read; clipboard-write"
      />
      {loading && (
        <div className="fixed inset-0 w-full h-full bg-white opacity-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl">Loading...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
