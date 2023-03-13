import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { ToastPresenter } from "../components/toast/Toast";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
          }
        `}
      </style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <ToastPresenter />
    </>
  );
}

export default trpc.withTRPC(App);
