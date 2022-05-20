import { compact } from "lodash";
import type * as CSS from "csstype";
import type * as hast from "hast";
import { h } from "hastscript";
import {
  fillBorderStyle,
  imageToDataURL,
  isVectorLikeNode,
  layoutStyle,
  processCharacters,
  svgToDataURL,
  textStyle,
  stringifyStyle,
} from "./util";

export async function figmaToMacaron(
  node: SceneNode,
  groupTopLeft: Vector = { x: 0, y: 0 }
): Promise<hast.Content | undefined> {
  // TODO: id from layer name

  if (!node.visible) {
    // TODO: support visibility
    return undefined;
  }

  if (isVectorLikeNode(node)) {
    try {
      const svg = await node.exportAsync({ format: "SVG" });
      const svgText = String.fromCharCode(...svg);

      // TODO: parse SVG and return svg tag

      return h("img", {
        src: svgToDataURL(svgText),
        style: stringifyStyle({
          ...layoutStyle(node, groupTopLeft),
        }),
      });
    } catch (error) {
      console.error(`error exporting ${node.name} to SVG`);
      console.error(String(error));
    }
  }

  switch (node.type) {
    case "RECTANGLE": {
      if (node.fills !== figma.mixed && node.fills.length) {
        const fill = node.fills[0];
        if (fill.type === "IMAGE" && fill.imageHash) {
          const image = figma.getImageByHash(fill.imageHash);
          const dataURL = image
            ? imageToDataURL(await image.getBytesAsync())
            : undefined;

          return h("img", {
            src: dataURL,
            style: stringifyStyle({
              ...layoutStyle(node, groupTopLeft),
            }),
          });
        }
      }

      return h("div", {
        style: stringifyStyle({
          ...fillBorderStyle(node),
          ...layoutStyle(node, groupTopLeft),
        }),
      });
    }
    case "TEXT": {
      return h(
        "p",
        {
          style: stringifyStyle({
            ...layoutStyle(node, groupTopLeft),
            ...textStyle(node),
          }),
        },
        ...processCharacters(node.characters)
      );
    }
    case "FRAME": {
      return h(
        "div",
        {
          style: stringifyStyle({
            ...fillBorderStyle(node),
            ...layoutStyle(node, groupTopLeft),
          }),
        },
        ...compact(
          await Promise.all(node.children.map((child) => figmaToMacaron(child)))
        )
      );
    }
    case "GROUP": {
      return h(
        "div",
        {
          tag: "div",
          style: stringifyStyle({
            ...layoutStyle(node, groupTopLeft),
          }),
        },
        ...compact(
          await Promise.all(
            node.children.map((child) =>
              figmaToMacaron(child, {
                x: node.x,
                y: node.y,
              })
            )
          )
        )
      );
    }
    default:
      return undefined;
  }
}
