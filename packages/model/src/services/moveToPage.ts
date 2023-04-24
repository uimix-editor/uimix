import { Page, Selectable } from "../models";

export function canMoveToPage(selectable: Selectable) {
  return (
    selectable.idPath.length === 1 && selectable.originalNode.type !== "image"
  );
}

export function moveToPage(selectable: Selectable, page: Page) {
  if (!canMoveToPage(selectable)) {
    return;
  }

  if (selectable.page === page) {
    return;
  }

  let node = selectable.originalNode;
  // always move whole component instead of just move variants/component roots
  if (node.parent?.type === "component") {
    node = node.parent;
  }

  page.node.append([node]);
}
