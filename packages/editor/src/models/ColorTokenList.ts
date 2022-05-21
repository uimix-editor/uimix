import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { ColorToken } from "./ColorToken";
import { Document } from "./Document";

export class ColorTokenList extends TreeNode<
  never,
  ColorTokenList,
  ColorToken
> {
  constructor(document: Document) {
    super();
    this.document = document;
  }

  readonly document: Document;

  get isUniqueNameRoot(): boolean {
    return true;
  }

  forName(name: string): ColorToken {
    return this.getDescendantByName(name) as ColorToken;
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
