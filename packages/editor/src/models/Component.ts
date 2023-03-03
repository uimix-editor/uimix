import { generateRefIDs } from "@uimix/render";
import { Node } from "./Node";

export class Component {
  static from(node: Node) {
    if (node.type !== "component") {
      return;
    }
    const firstChild = node.firstChild;
    if (!firstChild) {
      return;
    }
    return new Component(node, firstChild);
  }

  private constructor(node: Node, rootNode: Node) {
    this.node = node;
    this.rootNode = rootNode;
  }

  get variants(): Variant[] {
    const variants: Variant[] = [];
    for (const child of this.node.children) {
      const variant = Variant.from(child);
      if (variant) {
        variants.push(variant);
      }
    }
    return variants;
  }

  get refIDs(): Map<string, string> {
    return generateRefIDs(this.rootNode);
  } // <node ID, ref ID>

  readonly node: Node;
  readonly rootNode: Node;
}

export class Variant {
  static from(node: Node) {
    if (node.type !== "variant") {
      return;
    }
    return new Variant(node);
  }

  private constructor(node: Node) {
    this.node = node;
  }

  readonly node: Node;
}
