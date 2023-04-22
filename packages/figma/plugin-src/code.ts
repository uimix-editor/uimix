import { MessageToCode, MessageToUI } from "../types/message";
import { figmaNodesToMacaron } from "./toUIMix/node";
import * as Data from "@uimix/model/src/data/v1";

figma.showUI(__html__);

function postMessage(msg: MessageToUI) {
  figma.ui.postMessage(msg);
}

figma.ui.onmessage = async (msg: MessageToCode) => {
  switch (msg.type) {
    case "copy-nodes": {
      if (figma.currentPage.selection.length === 0) {
        figma.notify("Select a layer to copy");
        break;
      }

      const images = new Map<string, Data.Image>();
      const macaronLayers = await figmaNodesToMacaron(
        images,
        figma.currentPage.selection,
        "NONE",
        [0, 0]
      );
      const clipboardJSON: Data.NodeClipboardData = {
        uimixClipboardVersion: "0.0.1",
        type: "nodes",
        images: Object.fromEntries(images),
        nodes: macaronLayers,
      };

      postMessage({
        type: "copy-data",
        data: JSON.stringify(clipboardJSON),
      });
      break;
    }
    case "paste-nodes": {
      throw new Error("TODO: paste nodes");
      break;
    }
    case "notify": {
      figma.notify(msg.data);
      break;
    }
  }
};
