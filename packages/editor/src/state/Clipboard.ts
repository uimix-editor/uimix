import { NodeClipboardData, NodeJSON, ProjectJSON } from "@uimix/node-data";
import { IStyle } from "../models/Style";
import { generateID } from "../utils/ID";

const mimeType = "application/x-macaron-nodes";

function reassignNewIDs(data: ProjectJSON): ProjectJSON {
  const idMap = new Map<string, string>();

  const newNodes: Record<string, NodeJSON> = {};
  for (const [id, node] of Object.entries(data.nodes)) {
    const newID = generateID();
    idMap.set(id, newID);
    newNodes[newID] = { ...node };
  }

  for (const node of Object.values(newNodes)) {
    if (node.parent) {
      node.parent = idMap.get(node.parent) ?? node.parent;
    }
  }

  const newStyles: Record<string, Partial<IStyle>> = {};
  for (const [id, style] of Object.entries(data.styles)) {
    const idPath = id.split(":").map((id) => idMap.get(id) ?? id);
    newStyles[idPath.join(":")] = style;
  }

  return {
    ...data,
    nodes: newNodes,
    styles: newStyles,
  };
}

export class Clipboard {
  static async writeNodes(data: NodeClipboardData) {
    // const json = JSON.stringify(nodes);

    // await navigator.clipboard.write([
    //   new ClipboardItem({
    //     [`web ${mimeType}`]: new Blob([json], {
    //       type: mimeType,
    //     }),
    //   }),
    // ]);
    await navigator.clipboard.writeText(JSON.stringify(data));
  }

  static async readNodes(): Promise<NodeClipboardData | undefined> {
    const items = await navigator.clipboard.read();
    const item = items.find((item) => item.types.includes(`web ${mimeType}`));
    if (!item) {
      // try parsing text as JSOn
      const text = await navigator.clipboard.readText();
      if (!text) {
        return;
      }
      try {
        return NodeClipboardData.parse(JSON.parse(text));
      } catch (e) {
        console.error(e);
        return;
      }
    }
    // const blob = await item.getType(`web ${mimeType}`);
    // return JSONClipboardData.parse(JSON.parse(await blob.text()));
  }
}
