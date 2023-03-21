import { MessageToCode, MessageToUI } from "../types/message";
import { figmaNodesToMacaron } from "./toUIMix/node";

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

      const macaronLayers = await figmaNodesToMacaron(
        figma.currentPage.selection,
        "NONE",
        [0, 0]
      );
      postMessage({
        type: "copy-data",
        data: JSON.stringify({
          "application/x-macaron-layers": macaronLayers,
        }),
      });
      break;
    }
    case "paste-nodes": {
      throw new Error("TODO: paste nodes");
      break;
    }
    case "notify": {
      figma.notify(msg.message);
      break;
    }
  }
};
