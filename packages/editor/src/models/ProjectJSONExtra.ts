import { NodeJSON, ProjectJSON, StyleJSON } from "@uimix/node-data";
import { generateID } from "../utils/ID";

// FIXME: importing generateID breaks Next.js build (so I created a separate file for this function)

export function reassignNewIDs(data: ProjectJSON): ProjectJSON {
  const idMap = new Map<string, string>();

  const newNodes: Record<string, NodeJSON> = {};
  for (const [id, node] of Object.entries(data.nodes)) {
    const newID = id === "project" ? "project" : generateID();
    idMap.set(id, newID);
    newNodes[newID] = { ...node };
  }

  for (const node of Object.values(newNodes)) {
    if (node.parent) {
      node.parent = idMap.get(node.parent) ?? node.parent;
    }
  }

  const newStyles: Record<string, Partial<StyleJSON>> = {};
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
