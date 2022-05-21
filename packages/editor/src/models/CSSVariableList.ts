import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { CSSVariable } from "./CSSVariable";
import { Document } from "./Document";

export class CSSVariableList extends TreeNode<
  never,
  CSSVariableList,
  CSSVariable
> {
  constructor(document: Document) {
    super();
    this.document = document;
  }

  readonly document: Document;

  get isUniqueNameRoot(): boolean {
    return true;
  }

  forName(name: string): CSSVariable {
    return this.getDescendantByName(name) as CSSVariable;
  }

  selectAll(): void {
    for (const token of this.children) {
      token.selected = true;
    }
  }

  deselectAll(): void {
    for (const token of this.children) {
      token.selected = false;
    }
  }
}
