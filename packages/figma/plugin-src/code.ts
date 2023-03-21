import { MessageToCode, MessageToUI } from "../types/message";
import { buildProjectJSON, figmaNodesToMacaron } from "./toUIMix/node";
import * as UIMix from "@uimix/node-data";

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

      const images = new Map<string, UIMix.Image>();
      const macaronLayers = await figmaNodesToMacaron(
        images,
        figma.currentPage.selection,
        "NONE",
        [0, 0]
      );
      const projectJSON = buildProjectJSON(images, macaronLayers);

      postMessage({
        type: "copy-data",
        data: JSON.stringify({
          uimixNodes: projectJSON,
        }),
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
