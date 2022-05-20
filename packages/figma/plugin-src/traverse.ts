import { compact } from "lodash";
import type * as CSS from "csstype";
import type * as hast from "hast";
import { h } from "hastscript";
import {
  fillBorderStyle,
  imageToDataURL,
  isVectorLikeNode,
  positionStyle,
  processCharacters,
  svgToDataURL,
  textStyle,
  stringifyStyle,
  IDGenerator,
  layoutStyle,
} from "./util";

export async function figmaToMacaron(
  idGenerator: IDGenerator,
  node: SceneNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  groupTopLeft: Vector = { x: 0, y: 0 }
): Promise<hast.Content | undefined> {
  // TODO: id from layer name

  const id = idGenerator.generate(node.name);

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
        id,
        src: svgToDataURL(svgText),
        style: stringifyStyle({
          ...positionStyle(node, parentLayout, groupTopLeft),
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
            id,
            src: dataURL,
            style: stringifyStyle({
              ...positionStyle(node, parentLayout, groupTopLeft),
            }),
          });
        }
      }

      return h("div", {
        id,
        style: stringifyStyle({
          ...fillBorderStyle(node),
          ...positionStyle(node, parentLayout, groupTopLeft),
        }),
      });
    }
    case "TEXT": {
      return h(
        "div",
        {
          id,
          style: stringifyStyle({
            ...positionStyle(node, parentLayout, groupTopLeft),
            ...textStyle(node),
          }),
        },
        ...processCharacters(node.characters)
      );
    }
    case "COMPONENT":
    case "COMPONENT_SET":
    case "INSTANCE":
    case "FRAME": {
      return h(
        "div",
        {
          id,
          style: stringifyStyle({
            ...fillBorderStyle(node),
            ...layoutStyle(node),
            ...positionStyle(node, parentLayout, groupTopLeft),
          }),
        },
        ...compact(
          await Promise.all(
            node.children.map((child) =>
              figmaToMacaron(idGenerator, child, node.layoutMode)
            )
          )
        )
      );
    }
    case "GROUP": {
      return h(
        "div",
        {
          id,
          style: stringifyStyle({
            ...positionStyle(node, parentLayout, groupTopLeft),
          }),
        },
        ...compact(
          await Promise.all(
            node.children.map((child) =>
              figmaToMacaron(idGenerator, child, "NONE", {
                x: node.x,
                y: node.y,
              })
            )
          )
        )
      );
    }
    default:
      console.log("ignoring", node.type);
      return undefined;
  }
}
