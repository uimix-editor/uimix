import { useRouter } from "next/router";
import React from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../../components/Editor"), {
  ssr: false,
});

const Document = () => {
  const router = useRouter();
  const { id } = router.query;

  return <Editor documentId={id as string} />;
};

export default Document;
