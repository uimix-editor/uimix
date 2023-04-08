import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

const VSCodeEditor = dynamic(
  () => import("../../components/editor/VSCodeEditor"),
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
          .uimix-titlebar {
            -webkit-app-region: drag;
          }
      `}</style>
      </Head>
      <VSCodeEditor />
    </>
  );
};

export default LocalDocument;
