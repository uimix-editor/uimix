import { RPC } from "@uimix/typed-rpc";
import { iframeTarget } from "@uimix/typed-rpc/browser";
import * as Y from "yjs";
import { Project } from "../models/Project";
import {
  IRootToThumbnailTakerRPC,
  IThumbnailTakerToRootRPC,
} from "../thumbnailTaker/ThumbnailTakerRPC";

export class ThumbnailTakerHost {
  constructor(
    project: Project,
    updateScreenshot: (pngData: Uint8Array) => void
  ) {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.src = "/thumbnail-taker.html";
    document.body.appendChild(iframe);

    this.rpc = new RPC<IRootToThumbnailTakerRPC, IThumbnailTakerToRootRPC>(
      iframeTarget(iframe),
      {
        ready: async () => {
          const onUpdate = (data: Uint8Array) => {
            void this.rpc.remote.sync(data);
          };
          project.doc.on("update", onUpdate);
          onUpdate(Y.encodeStateAsUpdate(project.doc));
        },
        sendScreenshot: async (data: Uint8Array) => {
          updateScreenshot(data);
        },
      }
    );
  }

  rpc: RPC<IRootToThumbnailTakerRPC, IThumbnailTakerToRootRPC>;
}
