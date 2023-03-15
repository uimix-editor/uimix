import { useRouter } from "next/router";
import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

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
      <>TODO</>
    </>
  );
};

export default LocalDocument;
