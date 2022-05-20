import { figmaToMacaron } from "./traverse";
import { compact } from "lodash-es";
import { toHtml } from "hast-util-to-html";
import { IDGenerator } from "./util";

figma.showUI(__html__, { themeColors: true, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "copy") {
    if (figma.currentPage.selection.length === 0) {
      figma.notify("Select a layer to copy");
      return;
    }

    const idGenerator = new IDGenerator();

    const macaronLayers = compact(
      await Promise.all(
        figma.currentPage.selection.map((node) =>
          figmaToMacaron(idGenerator, node, "NONE", { x: 0, y: 0 })
        )
      )
    );

    const html = toHtml(macaronLayers);

    figma.ui.postMessage({
      type: "copy",
      html,
    });
  }
};
