import { HocuspocusProvider } from "@hocuspocus/provider";
import React, { useEffect, useRef, useState } from "react";
import { dynamicTrpc } from "../utils/trpc";
import * as Y from "yjs";

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

    const provider = new HocuspocusProvider({
      url: "ws://localhost:1234",
      name: documentId,
      token: () => {
        return dynamicTrpc.collaborative.token.query();
      },
    });
    provider.on("connect", () => {
      console.log("connected!");
      console.log(provider.document.getMap("project").toJSON());
      setLoading(false);
    });

    const doc = provider.document;

    const onMessage = (message: MessageEvent) => {
      if (message.source === iframe?.contentWindow) {
        if (message.data.type === "uimix:ready") {
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

    window.addEventListener("message", onMessage);

    return () => {
      provider.disconnect();
      window.removeEventListener("message", onMessage);
    };
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
