import { compact } from "../util";
import * as UIMix from "@uimix/node-data";
import { svgLikeNodeChecker } from "./SVGLikeNodeChecker";
import {
  getFrameStyle,
  getGroupStyle,
  getImageStyle,
  getSVGStyle,
  getTextStyle,
} from "./style";

function isSingleImageFill(
  fills: MinimalFillsMixin["fills"]
): fills is readonly [ImagePaint] {
  return (
    fills !== figma.mixed && fills.length === 1 && fills[0].type === "IMAGE"
  );
}

interface NodeWithStyle extends Omit<UIMix.NodeJSON, "index" | "parent"> {
  id: string;
  style: Partial<UIMix.StyleJSON>;
  children: NodeWithStyle[];
}

async function figmaToMacaron(
  images: Map<string, UIMix.Image>,
  node: SceneNode,
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<NodeWithStyle | undefined> {
  const createId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  // FigJam nodes are not supported
  if (
    node.type === "STICKY" ||
    node.type === "CONNECTOR" ||
    node.type === "SHAPE_WITH_TEXT" ||
    node.type === "CODE_BLOCK" ||
    node.type === "STAMP" ||
    node.type === "WIDGET" ||
    node.type === "EMBED" ||
    node.type === "LINK_UNFURL" ||
    node.type === "MEDIA" ||
    node.type === "WASHI_TAPE" ||
    node.type === "SECTION" ||
    node.type === "TABLE"
  ) {
    return;
  }

  if (
    node.type === "RECTANGLE" &&
    isSingleImageFill(node.fills) &&
    node.fills[0].imageHash
  ) {
    return {
      id: createId(),
      type: "image",
      name: node.name,
      style: await getImageStyle(images, node, parentLayout, offset),
      children: [],
    };
  }

  if (svgLikeNodeChecker.check(node)) {
    try {
      const svg = await node.exportAsync({ format: "SVG" });
      const svgText = String.fromCharCode(...svg);

      return {
        id: createId(),
        type: "svg",
        name: node.name,
        style: {
          ...getSVGStyle(node, parentLayout, offset),
          width: { type: "hugContents" },
          height: { type: "hugContents" },
          svgContent: svgText,
        },
        children: [],
      };
    } catch (error) {
      console.error(`error exporting ${node.name} to SVG`);
      console.error(String(error));
    }
  }

  switch (node.type) {
    case "GROUP": {
      return {
        id: createId(),
        type: "frame",
        name: node.name,
        style: await getGroupStyle(node, parentLayout, offset),
        children: await figmaNodesToMacaron(images, node.children, "NONE", [
          node.x,
          node.y,
        ]),
      };
    }
    case "COMPONENT":
    case "COMPONENT_SET":
    case "INSTANCE":
    case "FRAME": {
      return {
        id: createId(),
        type: "frame",
        name: node.name,
        style: await getFrameStyle(node, parentLayout, offset),
        children: await figmaNodesToMacaron(
          images,
          node.children,
          node.layoutMode,
          [node.strokeLeftWeight, node.strokeTopWeight]
        ),
      };
    }
    case "TEXT": {
      return {
        id: createId(),
        type: "text",
        name: node.name,
        style: await getTextStyle(node, parentLayout, offset),
        children: [],
      };
    }
  }
}

export async function figmaNodesToMacaron(
  images: Map<string, UIMix.Image>,
  nodes: readonly SceneNode[],
  parentLayout: BaseFrameMixin["layoutMode"],
  offset: [number, number]
): Promise<NodeWithStyle[]> {
  return compact(
    await Promise.all(
      nodes.map((child) => figmaToMacaron(images, child, parentLayout, offset))
    )
  );
}

export function buildProjectJSON(
  images: Map<string, UIMix.Image>,
  nodes: NodeWithStyle[]
): UIMix.ProjectJSON {
  const projectJSON: UIMix.ProjectJSON = {
    nodes: {},
    styles: {},
    images: Object.fromEntries(images),
  };

  const visitNode = (
    node: NodeWithStyle,
    parent: NodeWithStyle | undefined,
    index: number
  ) => {
    projectJSON.nodes[node.id] = {
      name: node.name,
      type: node.type,
      parent: parent?.id,
      index,
    };
    projectJSON.styles[node.id] = node.style;

    for (const [index, child] of node.children.entries()) {
      visitNode(child, node, index);
    }
  };

  for (const node of nodes) {
    visitNode(node, undefined, 0);
  }

  return projectJSON;
}
