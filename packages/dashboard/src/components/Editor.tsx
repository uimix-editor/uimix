import { HocuspocusProvider } from "@hocuspocus/provider";
import React, { useEffect, useRef } from "react";
import { dynamicTrpc } from "../utils/trpc";
import * as Y from "yjs";

const Editor: React.FC<{
  documentId: string;
}> = ({ documentId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

    const doc = provider.document;

    window.addEventListener("message", (message) => {
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
    });

    return () => {
      provider.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="fixed inset-0 w-full h-full"
      src="http://randomvalue.editor.localhost:5173"
    />
  );
};

export default Editor;
