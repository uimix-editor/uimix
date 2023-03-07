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

    console.log("TODO: fetch document from server and send it to the iframe");
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
