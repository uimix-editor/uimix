import { HocuspocusProvider } from "@hocuspocus/provider";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { trpc } from "../../utils/trpc";

const Document = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    const provider = new HocuspocusProvider({
      url: "ws://localhost:1234",
      name: "example-document",
    });

    const doc = provider.document;

    doc.on("update", (update) => {
      console.log("update", update);
    });
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="fixed inset-0 w-full h-full"
      src="http://randomvalue.editor.localhost:5173"
    />
  );
};

export default Document;
