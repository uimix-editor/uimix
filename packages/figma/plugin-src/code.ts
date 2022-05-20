import { figmaToMacaron } from "./traverse";
import { compact } from "lodash-es";
import { toHtml } from "hast-util-to-html";
import { IDGenerator } from "./util";
import { MessageToPlugin, MessageToUI } from "../message";

figma.showUI(__html__, { themeColors: true });

figma.ui.onmessage = async (msg: MessageToPlugin) => {
  switch (msg.type) {
    case "copy": {
      if (figma.currentPage.selection.length === 0) {
        figma.notify("Select a layer to copy");
        return;
      }

      const idGenerator = new IDGenerator();

      const macaronLayers = compact(
        await Promise.all(
          figma.currentPage.selection.map((node) =>
            figmaToMacaron(idGenerator, node, undefined, { x: 0, y: 0 })
          )
        )
      );

      const html = toHtml(macaronLayers);

      const messageToUI: MessageToUI = {
        type: "copy",
        data: html,
      };
      figma.ui.postMessage(messageToUI);
      break;
    }
    case "notify": {
      figma.notify(msg.data);
      break;
    }
  }
};
