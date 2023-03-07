import { HocuspocusProvider } from "@hocuspocus/provider";
import React, { useEffect, useRef } from "react";
import { dynamicTrpc } from "../utils/trpc";

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

    doc.on("update", (update) => {
      console.log("update", update);
    });

    window.addEventListener("message", (message) => {
      if (message.source === iframe?.contentWindow) {
        if (message.data.type === "uimix:update") {
          console.log(message.data);
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
