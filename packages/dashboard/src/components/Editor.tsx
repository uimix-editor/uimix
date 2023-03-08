import { HocuspocusProvider } from "@hocuspocus/provider";
import React, { useEffect, useRef, useState } from "react";
import { dynamicTrpc } from "../utils/trpc";
import * as Y from "yjs";
import { TypedEmitter } from "tiny-typed-emitter";

class Connection extends TypedEmitter<{
  ready(): void;
}> {
  constructor(iframe: HTMLIFrameElement, documentId: string) {
    super();
    this.iframe = iframe;

    this.provider = new HocuspocusProvider({
      url: "ws://localhost:1234",
      name: documentId,
      token: () => {
        return dynamicTrpc.collaborative.token.query();
      },
    });
    this.provider.on("connect", () => {
      console.log("connected!");
      console.log(this.provider.document.getMap("project").toJSON());
      this.hocuspocusReady = true;
      if (this.iframeReady) {
        this.emit("ready");
      }
    });

    window.addEventListener("message", this.onMessage);
  }

  dispose() {
    this.provider.disconnect();
    window.removeEventListener("message", this.onMessage);
  }

  onMessage = (message: MessageEvent) => {
    const { iframe } = this;
    const doc = this.provider.document;
    if (message.source === iframe.contentWindow) {
      if (message.data.type === "uimix:ready") {
        this.iframeReady = true;
        if (this.hocuspocusReady) {
          this.emit("ready");
        }

        console.log("uimix:ready");
        const sendUpdate = (update: Uint8Array) => {
          console.log(update);
          iframe.contentWindow?.postMessage(
            {
              type: "uimix:sync",
              data: update,
            },
            "*"
          );
        };
        console.log(doc.getMap("project").toJSON());
        sendUpdate(Y.encodeStateAsUpdate(doc));
        doc.on("update", (update) => {
          sendUpdate(update);
        });
      }

      if (message.data.type === "uimix:update") {
        console.log("uimix:update");
        Y.applyUpdate(doc, message.data.data);
        console.log(doc.getMap("project").toJSON());
      }
    }
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
    connection.on("loadingChange", () => {
      setLoading(connection.loading);
    });
    return () => connection.dispose();
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full">
      <iframe
        ref={iframeRef}
        className="fixed inset-0 w-full h-full"
        src="http://randomvalue.editor.localhost:5173"
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
