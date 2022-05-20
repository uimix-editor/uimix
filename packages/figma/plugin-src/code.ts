import { figmaToMacaron } from "./traverse";
import { compact } from "lodash-es";

figma.showUI(__html__, { themeColors: true, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "copy") {
    if (figma.currentPage.selection.length === 0) {
      figma.notify("Select a layer to copy");
      return;
    }

    const macaronLayers = compact(
      await Promise.all(
        figma.currentPage.selection.map((node) =>
          figmaToMacaron(node, { x: 0, y: 0 })
        )
      )
    );
    console.log(macaronLayers);
  }
};
