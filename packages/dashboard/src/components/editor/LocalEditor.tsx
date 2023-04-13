import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { TypedEmitter } from "tiny-typed-emitter";
import { iframeTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import type {
  IRootToEditorRPCHandler,
  IEditorToRootRPCHandler,
} from "@uimix/editor/src/types/IFrameRPC";
import { ProjectData } from "@uimix/model/src/collaborative";
import { LoadingErrorOverlay } from "./LoadingErrorOverlay";
import { DocumentMetadata, getDesktopAPI } from "../../types/DesktopAPI";
import { assertNonNull } from "../../utils/assertNonNull";

// TODO: test

class Connection extends TypedEmitter<{
  readyToShow(): void;
}> {
  constructor(iframe: HTMLIFrameElement) {
    super();
    this.iframe = iframe;
    this.rpc = new RPC<IRootToEditorRPCHandler, IEditorToRootRPCHandler>(
      iframeTarget(iframe),
      {
        ready: async () => {
          this.iframeReady = true;
          if (this.fileReady) {
            await this.onReady();
          }
        },
        update: async (data: Uint8Array) => {
          Y.applyUpdate(this.data.doc, data);
          await getDesktopAPI()?.setDocumentData(this.data.toJSON());
        },
        uploadImage: async (
          hash: string,
          contentType: string,
          data: Uint8Array
        ) => {
          // just return data url
          return `data:${contentType};base64,${Buffer.from(data).toString(
            "base64"
          )}`;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        updateThumbnail: async (pngData) => {
          // TODO: set thumbnail for file
        },

        getClipboard: async (type) => {
          if (type !== "text") {
            throw new Error(`unsupported clipboard type: ${type}`);
          }
          return await navigator.clipboard.readText();
        },
        setClipboard: async (type, text) => {
          if (type !== "text") {
            throw new Error(`unsupported clipboard type: ${type}`);
          }
          await navigator.clipboard.writeText(text);
        },
      }
    );

    const api = getDesktopAPI();
    if (!api) {
      throw new Error("Desktop API not available");
    }

    void api.getDocumentData().then((data) => {
      if (this.fileReady) {
        return;
      }
      console.log("got data", data);
      this.data.loadJSON(data);
      this.fileReady = true;
      if (this.iframeReady) {
        void this.onReady();
      }
    });

    this.dataChangeDisposer = api.onDocumentDataChange((data) => {
      console.log("got data change", data);
      this.data.loadJSON(data);
    });
  }

  private rpc: RPC<IRootToEditorRPCHandler, IEditorToRootRPCHandler>;
  private iframe: HTMLIFrameElement;
  private data = new ProjectData();
  private fileReady = false;
  private iframeReady = false;
  private dataChangeDisposer: () => void;

  dispose() {
    this.rpc.dispose();
    this.dataChangeDisposer();
  }

  private onReady = async () => {
    this.data.doc.on("update", (update: Uint8Array) => {
      void this.rpc.remote.update(update);
    });
    await this.rpc.remote.init(Y.encodeStateAsUpdate(this.data.doc));
    this.emit("readyToShow");
  };
}

const LocalEditor: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<DocumentMetadata>({
    name: "",
  });

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }
    const connection = new Connection(iframe);
    connection.on("readyToShow", () => {
      setLoading(false);
    });
    return () => connection.dispose();
  }, []);

  useEffect(() => {
    const api = getDesktopAPI();
    if (!api) {
      return;
    }
    const listener = (metadata: DocumentMetadata) => {
      setMetadata(metadata);
    };

    void api.getDocumentMetadata().then(setMetadata);
    return api.onDocumentMetadataChange(listener);
  }, []);

  const editorSrc =
    assertNonNull(process.env.NEXT_PUBLIC_EDITOR_URL).replace(
      "://",
      // TODO: use unique ID for subdomain?
      `://local.`
    ) + "?embed=true&titleBarPadding=40";

  return (
    <div className="text-neutral-800 flex flex-col text-xs">
      <div className="z-10 fixed top-0 left-0 right-0 h-10 border-b border-neutral-200 flex items-center justify-center uimix-titlebar">
        <div className="text-xs font-medium">{metadata.name}</div>
      </div>
      <iframe
        ref={iframeRef}
        // looks like Chrome sends wrong coordinates in pointerrawupdate events inside iframes (TODO: report)
        // place the iframe full screen to avoid this
        className="fixed inset-0 w-full h-full"
        src={editorSrc}
        allow="clipboard-read; clipboard-write"
      />
      {loading && <LoadingErrorOverlay isError={false} />}
    </div>
  );
};

export default LocalEditor;
