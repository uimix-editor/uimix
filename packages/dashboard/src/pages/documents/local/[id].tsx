import { useRouter } from "next/router";
import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const LocalEditor = dynamic(
  () => import("../../../components/editor/LocalEditor"),
  { ssr: false }
);

const LocalDocument = () => {
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
      <LocalEditor documentId={id as string} />
    </>
  );
};

export default LocalDocument;
