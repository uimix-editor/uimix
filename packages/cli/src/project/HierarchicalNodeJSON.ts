import * as Data from "@uimix/model/src/data/v1";

export interface HierarchicalNodeJSON extends Data.Node {
  id: string;
  children: HierarchicalNodeJSON[];
}
export function toHierarchicalNodeJSONRecord(
  nodes: Record<string, Data.Node>
): Record<string, HierarchicalNodeJSON> {
  const hierarchicalNodes: Record<string, HierarchicalNodeJSON> = {};

  for (const [id, node] of Object.entries(nodes)) {
    hierarchicalNodes[id] = {
      ...node,
      id,
      children: [],
    };
  }

  for (const [id, node] of Object.entries(nodes)) {
    if (node.parent) {
      hierarchicalNodes[node.parent].children.push(hierarchicalNodes[id]);
    }
  }

  for (const node of Object.values(hierarchicalNodes)) {
    node.children.sort((a, b) => a.index - b.index);
  }

  return hierarchicalNodes;
}

export function toHierarchicalNodeJSONs(
  nodes: Record<string, Data.Node>
): HierarchicalNodeJSON[] {
  const hierarchicalNodes = toHierarchicalNodeJSONRecord(nodes);
  return Object.values(hierarchicalNodes).filter((node) => !node.parent);
}
