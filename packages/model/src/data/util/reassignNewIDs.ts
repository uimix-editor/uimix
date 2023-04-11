import { NodeJSON, ProjectJSON, StyleJSON } from "../v1";
import { generateID } from "@uimix/foundation/src/utils/ID";

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
    const newStyle = { ...style };
    if (newStyle.mainComponent) {
      newStyle.mainComponent =
        idMap.get(newStyle.mainComponent) ?? newStyle.mainComponent;
    }

    const idPath = id.split(":").map((id) => idMap.get(id) ?? id);
    newStyles[idPath.join(":")] = newStyle;
  }

  return {
    ...data,
    nodes: newNodes,
    styles: newStyles,
  };
}
