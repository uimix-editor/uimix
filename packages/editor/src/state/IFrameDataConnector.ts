import * as Y from "yjs";
import { generateExampleNodes } from "../models/generateExampleNodes";
import { parentWindowTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import { ProjectState } from "./ProjectState";
import { action } from "mobx";

export interface IRootToEditorRPCHandler {
  sync(data: Uint8Array): Promise<void>;
  init(data: Uint8Array): Promise<void>;
}

export interface IEditorToRootRPCHandler {
  ready(): Promise<void>;
  update(data: Uint8Array): Promise<void>;
  uploadImage(
    hash: string,
    contentType: string,
    data: Uint8Array
  ): Promise<string>;
}

export class IFrameDataConnector {
  constructor(state: ProjectState) {
    this.state = state;
    this.state.doc.on("update", (data) => {
      this.updates.push(data);
      if (!this.sendQueued) {
        queueMicrotask(() => {
          this.sendUpdate();
        });
        this.sendQueued = true;
      }
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
        console.log("uimix:sync");
        Y.applyUpdate(state.doc, data);
      }),
      init: action((data: Uint8Array) => {
        console.log("uimix:init");
        Y.applyUpdate(state.doc, data);

        const pages = state.project.pages.all;
        if (pages.length === 0) {
          const page = state.project.nodes.create("page");
          page.name = "Page 1";
          state.project.node.append([page]);
          state.pageID = page.id;
          generateExampleNodes(page);
        } else {
          state.pageID = pages[0].id;
        }
        console.log("setting page id", state.pageID);
      }),
    });

    this.rpc.remote.ready();
  }

  private state: ProjectState;
  private rpc: RPC<IEditorToRootRPCHandler, IRootToEditorRPCHandler>;
  private updates: Uint8Array[] = [];
  private sendQueued = false;

  private sendUpdate() {
    this.sendQueued = false;
    if (this.updates.length) {
      this.rpc.remote.update(Y.mergeUpdates(this.updates));
      this.updates = [];
    }
  }
}
