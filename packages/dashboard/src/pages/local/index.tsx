import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const LocalEditor = dynamic(
  () => import("../../components/editor/LocalEditor"),
  { ssr: false }
);

const LocalDocument = () => {
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
      <LocalEditor />
    </>
  );
};

export default LocalDocument;
