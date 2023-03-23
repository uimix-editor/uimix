import * as Y from "yjs";
import { parentWindowTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import { action } from "mobx";
import { debounce } from "lodash-es";
import { ProjectState } from "../state/ProjectState";
import {
  IRootToScreenshotTakerRPC,
  IScreenshotTakerToRootRPC,
} from "./ScreenshotTakerRPC";
import { takeScreenshot } from "./takeScreenshot";

export class ScreenshotDataConnector {
  constructor(state: ProjectState) {
    this.state = state;
    this.rpc = new RPC(parentWindowTarget(), {
      sync: action((data: Uint8Array) => {
        Y.applyUpdate(state.doc, data);
        void this.takeScreenshot();
      }),
    });

    void this.rpc.remote.ready();
  }

  private state: ProjectState;
  private rpc: RPC<IScreenshotTakerToRootRPC, IRootToScreenshotTakerRPC>;

  takeScreenshot = debounce(async () => {
    const result = await takeScreenshot(this.state.project);
    if (result) {
      await this.rpc.remote.sendScreenshot(result);
      console.log("taken thumbnail");
    }
  }, 1000);
}
