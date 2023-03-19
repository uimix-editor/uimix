import { HocuspocusProvider } from "@hocuspocus/provider";
import React, { useEffect, useRef, useState } from "react";
import { dynamicTrpc, trpc } from "../../utils/trpc";
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
import { DoubleClickToEdit } from "../DoubleClickToEdit";
import { toastController } from "../toast/ToastController";
import { LoadingErrorOverlay } from "./LoadingErrorOverlay";

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
          this.iframeReady = true;
          if (this.hocuspocusReady) {
            void this.onReady();
          }
        },
        update: async (data: Uint8Array) => {
          const doc = this.provider.document;
          Y.applyUpdate(doc, data);
        },
        uploadImage: async (
          hash: string,
          contentType: string,
          data: Uint8Array
        ) => {
          const { uploadURL, url } = await dynamicTrpc.image.getUploadURL.query(
            {
              hash,
              contentType,
            }
          );
          await fetch(uploadURL, {
            method: "PUT",
            headers: {
              "Content-Type": contentType,
            },
            body: data,
          });
          return url;
        },
      }
    );

    this.provider = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_COLLABORATIVE_BACKEND_URL as string,
      name: documentId,
      token: () => {
        return dynamicTrpc.collaborative.token.query();
      },
      onSynced: () => {
        if (this.hocuspocusReady) {
          return;
        }
        this.hocuspocusReady = true;
        if (this.iframeReady) {
          void this.onReady();
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
    const doc = this.provider.document;

    doc.on("update", (update) => {
      void this.rpc.remote.sync(update as never);
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

  const editorSrc = process.env.NEXT_PUBLIC_EDITOR_URL?.replace(
    "://",
    // adds subdomain to the editor url
    `://${documentId}.`
  );

  return (
    <div className="text-neutral-800 flex flex-col text-xs">
      <div className="z-10 fixed top-0 left-0 right-0 h-10 border-b border-neutral-200 flex items-center justify-center">
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
              await documentQuery.refetch();
            } catch {
              toastController.show({
                type: "error",
                message: "Failed to rename document",
              });
            }
          }}
        />
      </div>
      <iframe
        ref={iframeRef}
        // looks like Chrome sends wrong coordinates in pointerrawupdate events inside iframes (TODO: report)
        // place the iframe full screen to avoid this
        className="fixed inset-0 w-full h-full"
        src={editorSrc}
        allow="clipboard-read; clipboard-write"
      />
      {(loading || isError) && <LoadingErrorOverlay isError={isError} />}
    </div>
  );
};

export default Editor;
