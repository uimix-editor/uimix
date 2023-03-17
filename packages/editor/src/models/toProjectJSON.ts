import { ProjectJSON, NodeJSON } from "@uimix/node-data";
import { Selectable } from "./Selectable";
import { IStyle } from "./Style";

// TODO generate correctly from instance contents
export function selectablesToProjectJSON(
  selectables: Selectable[]
): ProjectJSON {
  const nodeJSONs: Record<string, NodeJSON> = {};
  const styles: Record<string, Partial<IStyle>> = {};

  const addRecursively = (selectable: Selectable) => {
    if (selectable.idPath.length === 1) {
      const node = selectable.originalNode;
      nodeJSONs[node.id] = node.toJSON();
      if (selectables.includes(selectable)) {
        nodeJSONs[node.id].parent = undefined;
      }
    }

    styles[selectable.id] = selectable.selfStyle.toJSON();
    for (const child of selectable.children) {
      addRecursively(child);
    }
  };

  for (const selected of selectables) {
    addRecursively(selected);
  }

  return {
    nodes: nodeJSONs,
    styles,
  };
}
