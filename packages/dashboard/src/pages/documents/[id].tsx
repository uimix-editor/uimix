import { useRouter } from "next/router";
import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const Editor = dynamic(() => import("../../components/Editor"), {
  ssr: false,
});

const Document = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Document</title>
        <style>{`
          body {
            overscroll-behavior: none;
          }
      `}</style>
      </Head>
      <Editor documentId={id as string} />
    </>
  );
};

export default Document;
