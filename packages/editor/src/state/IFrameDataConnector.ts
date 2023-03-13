import * as Y from "yjs";
import { generateExampleNodes } from "../models/generateExampleNodes";
import { parentWindowTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import { ProjectState } from "./ProjectState";
import { action } from "mobx";
import { IEditorToRootRPCHandler, IRootToEditorRPCHandler } from "./IFrameRPC";
import { throttle } from "lodash-es";

export class IFrameDataConnector {
  constructor(state: ProjectState) {
    this.state = state;
    this.state.doc.on("update", (data) => {
      this.updates.push(data);
      this.sendUpdate();
    });

    queueMicrotask(() => {
      this.state.project.imageManager.uploadImage = async (
        hash: string,
        contentType: string,
        data: Uint8Array
      ) => {
        return this.rpc.remote.uploadImage(hash, contentType, data);
      };
    });

    this.rpc = new RPC(parentWindowTarget(), {
      sync: action((data: Uint8Array) => {
        Y.applyUpdate(state.doc, data);
      }),
      init: action((data: Uint8Array) => {
        Y.applyUpdate(state.doc, data);

        const pages = state.project.pages.all;
        if (pages.length === 0) {
          const page = state.project.nodes.create("page");
          page.name = "Page 1";
          state.project.node.append([page]);
          state.pageID = page.id;
          generateExampleNodes(page);
          if (state.project.componentURLs.length === 0) {
            state.project.componentURLs.push([
              "https://cdn.jsdelivr.net/gh/uimix-editor/uimix@c1b589ca/packages/sandbox/dist-components/components.js",
              "https://cdn.jsdelivr.net/gh/uimix-editor/uimix@c1b589ca/packages/sandbox/dist-components/style.css",
            ]);
          }
        } else {
          state.pageID = pages[0].id;
        }
        state.undoManager.clear();
      }),
    });

    this.rpc.remote.ready();
  }

  private state: ProjectState;
  private rpc: RPC<IEditorToRootRPCHandler, IRootToEditorRPCHandler>;
  private updates: Uint8Array[] = [];

  private sendUpdate = throttle(() => {
    if (this.updates.length) {
      this.rpc.remote.update(Y.mergeUpdates(this.updates));
      this.updates = [];
    }
  }, 100);
}
