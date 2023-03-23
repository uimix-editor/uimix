import * as Y from "yjs";
import { generateExampleNodes } from "../models/generateExampleNodes";
import { parentWindowTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import { ProjectState } from "./ProjectState";
import { action } from "mobx";
import { IEditorToRootRPCHandler, IRootToEditorRPCHandler } from "./IFrameRPC";
import { throttle } from "lodash-es";
import { ScreenshotTakerHost } from "./ScreenshotTakerHost";

export class IFrameDataConnector {
  constructor(state: ProjectState) {
    this.state = state;
    this.updates.push(Y.encodeStateAsUpdate(state.doc));

    this.state.doc.on("update", (data: Uint8Array) => {
      this.updates.push(data);
      this.sendUpdate();
    });

    this.state.project.imageManager.uploadImage = async (
      hash: string,
      contentType: string,
      data: Uint8Array
    ) => {
      return this.rpc.remote.uploadImage(hash, contentType, data);
    };

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
              "https://cdn.jsdelivr.net/gh/uimix-editor/uimix@ba0157d5/packages/sandbox/dist-components/components.js",
              "https://cdn.jsdelivr.net/gh/uimix-editor/uimix@ba0157d5/packages/sandbox/dist-components/style.css",
            ]);
          }
        } else {
          state.pageID = pages[0].id;
        }
        state.undoManager.clear();
      }),
    });

    new ScreenshotTakerHost(state.project);

    void this.rpc.remote.ready();
  }

  private state: ProjectState;
  private rpc: RPC<IEditorToRootRPCHandler, IRootToEditorRPCHandler>;
  private updates: Uint8Array[] = [];

  private sendUpdate = throttle(() => {
    if (this.updates.length) {
      void this.rpc.remote.update(Y.mergeUpdates(this.updates));
      this.updates = [];
    }
  }, 100);
}
