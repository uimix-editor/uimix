import React, { useEffect, useRef, useState } from "react";
import { dynamicTrpc } from "../../utils/trpc";
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
import { LoadingErrorOverlay } from "./LoadingErrorOverlay";
import {
  getDesktopAPI,
  LocalDocument,
  ProjectJSON,
} from "../../types/DesktopAPI";

// TODO: test

function loadProjectJSON(ydoc: Y.Doc, projectJSON: ProjectJSON): void {
  // TODO: support overwrite

  const nodes = ydoc.getMap("nodes");
  for (const [id, json] of Object.entries(projectJSON.nodes)) {
    const data = new Y.Map();
    for (const [key, value] of Object.entries(json)) {
      data.set(key, value);
    }
    nodes.set(id, data);
  }

  const styles = ydoc.getMap("styles");
  for (const [id, json] of Object.entries(projectJSON.styles)) {
    const data = new Y.Map();
    for (const [key, value] of Object.entries(json)) {
      data.set(key, value);
    }
    styles.set(id, data);
  }

  const componentURLs = ydoc.getArray("componentURLs");
  componentURLs.delete(0, componentURLs.length);
  for (const url of projectJSON.componentURLs ?? []) {
    componentURLs.push([url]);
  }

  const images = ydoc.getMap("images");
  images.clear();
  for (const [hash, url] of Object.entries(projectJSON.images ?? {})) {
    images.set(hash, url);
  }
}

function toProjectJSON(ydoc: Y.Doc): ProjectJSON {
  const json: ProjectJSON = {
    nodes: ydoc.getMap("nodes").toJSON(),
    styles: ydoc.getMap("styles").toJSON(),
    componentURLs: ydoc.getArray("componentURLs").toJSON(),
    images: ydoc.getMap("images").toJSON(),
  };
  // delete dangling nodes
  for (const id of Object.keys(json.nodes)) {
    if (json.nodes[id].type !== "project" && !json.nodes[id].parent) {
      delete json.nodes[id];
    }
  }
  // delete styles for deleted nodes
  for (const styleID of Object.keys(json.styles)) {
    const ids = styleID.split(":");
    for (const id of ids) {
      if (!json.nodes[id]) {
        delete json.styles[styleID];
      }
    }
  }
  return json;
}

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
          if (this.fileReady) {
            this.onReady();
          }
        },
        update: async (data: Uint8Array) => {
          Y.applyUpdate(this.doc, data);
          getDesktopAPI()?.setLocalDocumentData(
            documentId,
            toProjectJSON(this.doc)
          );
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
      }
    );

    getDesktopAPI()
      ?.getLocalDocumentData(documentId)
      .then((data) => {
        if (this.fileReady) {
          return;
        }
        console.log("got data", data);
        loadProjectJSON(this.doc, data);
        this.fileReady = true;
        if (this.iframeReady) {
          this.onReady();
        }
      });
  }

  private rpc: RPC<IRootToEditorRPCHandler, IEditorToRootRPCHandler>;
  private iframe: HTMLIFrameElement;
  private doc = new Y.Doc();
  private fileReady = false;
  private iframeReady = false;

  dispose() {
    this.rpc.dispose();
  }

  private onReady = async () => {
    this.doc.on("update", (update) => {
      this.rpc.remote.sync(update);
    });
    await this.rpc.remote.init(Y.encodeStateAsUpdate(this.doc));
    this.emit("readyToShow");
  };
}

const LocalEditor: React.FC<{
  documentId: string;
}> = ({ documentId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<LocalDocument>();

  useEffect(() => {
    const desktopApi = getDesktopAPI();
    if (desktopApi) {
      desktopApi.getLocalDocument(documentId).then(setDocument);
    }
  }, []);

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
        <div className="text-xs font-medium">{document?.title}</div>
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
