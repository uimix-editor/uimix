import * as Y from "yjs";
import { parentWindowTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import { ProjectState } from "./ProjectState";
import { action } from "mobx";
import { IEditorToRootRPCHandler, IRootToEditorRPCHandler } from "./IFrameRPC";
import { throttle } from "lodash-es";
import { ThumbnailTakerHost } from "./ThumbnailTakerHost";

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

    this.rpc = new RPC<IEditorToRootRPCHandler, IRootToEditorRPCHandler>(
      parentWindowTarget(),
      {
        update: action(async (data: Uint8Array) => {
          Y.applyUpdate(state.doc, data);
        }),
        init: action(async (data: Uint8Array) => {
          Y.applyUpdate(state.doc, data);
          state.pageID = state.project.pages.all[0]?.id;
        }),
      }
    );

    new ThumbnailTakerHost(state.project, (pngData) => {
      void this.rpc.remote.updateThumbnail(pngData);
    });

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
