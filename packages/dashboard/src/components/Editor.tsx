import { HocuspocusProvider } from "@hocuspocus/provider";
import React, { useEffect, useRef, useState } from "react";
import { dynamicTrpc, trpc } from "../utils/trpc";
import * as Y from "yjs";
import { TypedEmitter } from "tiny-typed-emitter";
import { iframeTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import type {
  IRootToEditorRPCHandler,
  IEditorToRootRPCHandler,
} from "@uimix/editor/src/state/IFrameRPC";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { DoubleClickToEdit } from "./DoubleClickToEdit";
import { toastController } from "./toast/ToastController";

class Connection extends TypedEmitter<{
  readyToShow(): void;
}> {
  constructor(iframe: HTMLIFrameElement, documentId: string) {
    super();
    this.iframe = iframe;
    this.rpc = new RPC<IRootToEditorRPCHandler, IEditorToRootRPCHandler>(
      iframeTarget(iframe),
      {
        ready: async () => {
          console.log("iframe:ready");
          this.iframeReady = true;
          if (this.hocuspocusReady) {
            this.onReady();
          }
        },
        update: async (data: Uint8Array) => {
          const doc = this.provider.document;
          console.log("uimix:update");
          Y.applyUpdate(doc, data);
          console.log(doc.getMap("project").toJSON());
        },
        uploadImage: async (
          hash: string,
          contentType: string,
          data: Uint8Array
        ) => {
          console.log("uimix:uploadImage", hash, contentType, data);
          const { uploadURL, url } = await dynamicTrpc.image.getUploadURL.query(
            {
              hash,
              contentType,
            }
          );
          console.log(uploadURL);
          const res = await fetch(uploadURL, {
            method: "PUT",
            headers: {
              "Content-Type": contentType,
            },
            body: data,
          });
          console.log(res);
          return url;
        },
      }
    );

    this.provider = new HocuspocusProvider({
      url: "ws://localhost:1234",
      name: documentId,
      token: () => {
        return dynamicTrpc.collaborative.token.query();
      },
      onAuthenticated: () => {
        if (this.hocuspocusReady) {
          return;
        }
        console.log("connected!");
        const data = this.provider.document.getMap("project");
        console.log(data.toJSON());
        this.hocuspocusReady = true;
        if (this.iframeReady) {
          this.onReady();
        }
      },
    });
  }

  private rpc: RPC<IRootToEditorRPCHandler, IEditorToRootRPCHandler>;
  private iframe: HTMLIFrameElement;
  private provider: HocuspocusProvider;
  private hocuspocusReady = false;
  private iframeReady = false;

  dispose() {
    this.provider.disconnect();
    this.rpc.dispose();
  }

  private onReady = async () => {
    console.log("-- ready");

    const doc = this.provider.document;
    console.log(doc.getMap("project").toJSON());

    doc.on("update", (update) => {
      this.rpc.remote.sync(update);
    });
    await this.rpc.remote.init(Y.encodeStateAsUpdate(doc));
    this.emit("readyToShow");
  };
}

const Editor: React.FC<{
  documentId: string;
}> = ({ documentId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const documentQuery = trpc.document.get.useQuery({
    id: documentId,
  });
  const documentUpdateMutation = trpc.document.update.useMutation();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }
    const connection = new Connection(iframe, documentId);
    connection.on("readyToShow", () => {
      setLoading(false);
    });
    return () => connection.dispose();
  }, []);

  const isError = documentQuery.status === "error";

  return (
    <div className="fixed inset-0 w-full h-full text-neutral-800 flex flex-col text-xs">
      <div className="h-10 border-b border-neutral-200 relative flex items-center justify-center">
        <Link
          className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center"
          href="/documents"
        >
          <Icon icon="material-symbols:chevron-left" className="text-base" />
        </Link>
        <DoubleClickToEdit
          className="text-xs font-medium"
          value={documentQuery.data?.title ?? ""}
          onChange={async (title) => {
            try {
              await documentUpdateMutation.mutateAsync({
                id: documentId,
                title,
              });
              documentQuery.refetch();
            } catch {
              toastController.show({
                type: "error",
                message: "Failed to rename document",
              });
            }
          }}
        />
      </div>
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          className="absolute inset-0 w-full h-full"
          src={`http://${documentId}.editor.localhost:5173`}
          allow="clipboard-read; clipboard-write"
        />
        {(loading || isError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            {isError ? (
              <div className="w-fit z-50 bg-red-500 text-red-500 rounded-full px-1 text-xs outline-none">
                <div className="flex items-center gap-2 p-2 text-xs">
                  <div className="bg-white p-1 rounded-full">
                    <Icon
                      icon="material-symbols:priority-high-rounded"
                      className="text-base"
                    />
                  </div>
                  <span className="text-white font-medium">
                    Failed to load document
                  </span>
                </div>
              </div>
            ) : (
              // https://flowbite.com/docs/components/spinner/#default-spinner
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-500 fill-blue-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
