import * as Y from "yjs";
import { generateExampleNodes } from "../models/generateExampleNodes";
import { parentWindowTarget } from "@uimix/typed-rpc/browser";
import { RPC } from "@uimix/typed-rpc";
import { action } from "mobx";
import { debounce, throttle } from "lodash-es";
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
        console.log(
          "screenshot taker sync",
          this.state.project.pages.all.length
        );
        this.takeScreenshot();
      }),
    });

    void this.rpc.remote.ready();
  }

  private state: ProjectState;
  private rpc: RPC<IScreenshotTakerToRootRPC, IRootToScreenshotTakerRPC>;

  takeScreenshot = debounce(async () => {
    const result = await takeScreenshot(this.state.project);
    console.log(result);
  }, 1000);
}
