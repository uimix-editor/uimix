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

  page.node.append([selectable.originalNode]);
}
