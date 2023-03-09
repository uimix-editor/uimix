import { HocuspocusProvider } from "@hocuspocus/provider";
import React, { useEffect, useRef, useState } from "react";
import { dynamicTrpc, trpc } from "../utils/trpc";
import * as Y from "yjs";
import { TypedEmitter } from "tiny-typed-emitter";
import { iframeTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import type {
  IRootToEditorRPCHandler,
  IEditorToRootRPCHandler,
} from "../../../editor/src/state/IFrameDataConnector";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { DoubleClickToEdit } from "./DoubleClickToEdit";

class Connection extends TypedEmitter<{
  ready(): void;
}> {
  constructor(iframe: HTMLIFrameElement, documentId: string) {
    super();
    this.iframe = iframe;
    this.rpc = new RPC(iframeTarget(iframe), {
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
    });

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

  private rpc: RPC<IRootToEditorRPCHandler, IEditorToRootRPCHandler>;
  private iframe: HTMLIFrameElement;
  private provider: HocuspocusProvider;
  private hocuspocusReady = false;
  private iframeReady = false;

  dispose() {
    this.provider.disconnect();
    this.rpc.dispose();
  }

  private onReady = () => {
    console.log("-- ready");

    const doc = this.provider.document;
    console.log(doc.getMap("project").toJSON());

    this.rpc.remote.init(Y.encodeStateAsUpdate(doc));
    doc.on("update", (update) => {
      this.rpc.remote.sync(update);
    });
  };
}

const Editor: React.FC<{
  documentId: string;
}> = ({ documentId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const document = trpc.document.get.useQuery({
    id: documentId,
  }).data;

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
    <div className="fixed inset-0 w-full h-full text-neutral-800">
      <div className="flex flex-col w-full h-full">
        <div className="h-10 border-b border-neutral-200 relative flex items-center justify-center">
          <Link
            className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center"
            href="/documents"
          >
            <Icon icon="material-symbols:chevron-left" className="text-base" />
          </Link>
          <DoubleClickToEdit
            value={document?.title ?? ""}
            onChange={(title) => {
              // TODO
            }}
          />
        </div>
        <iframe
          ref={iframeRef}
          className="flex-1"
          src={`http://${documentId}.editor.localhost:5173`}
          allow="clipboard-read; clipboard-write"
        />
      </div>
      {loading && (
        <div className="fixed inset-0 w-full h-full bg-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-base text-neutral-600">Loading...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
