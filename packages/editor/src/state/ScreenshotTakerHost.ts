import { RPC } from "@uimix/typed-rpc";
import { iframeTarget } from "@uimix/typed-rpc/browser";
import * as Y from "yjs";
import { Project } from "../models/Project";
import {
  IRootToScreenshotTakerRPC,
  IScreenshotTakerToRootRPC,
} from "../screenshotTaker/ScreenshotTakerRPC";

export class ScreenshotTakerHost {
  constructor(project: Project) {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.src = "/screenshot-taker.html";
    document.body.appendChild(iframe);

    this.rpc = new RPC<IRootToScreenshotTakerRPC, IScreenshotTakerToRootRPC>(
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
          console.log("TODO: set screenshot data in project");
        },
      }
    );
  }

  rpc: RPC<IRootToScreenshotTakerRPC, IScreenshotTakerToRootRPC>;
}
