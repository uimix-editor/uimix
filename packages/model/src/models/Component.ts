import { VariantCondition } from "../data/v1";
import { generateRefIDs } from "@uimix/foundation/src/utils/Name";
import { Node } from "./Node";
import { Selectable } from "./Selectable";
import { Page } from "./Page";
import { Project } from "./Project";

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

  get id(): string {
    return this.node.id;
  }

  get name(): string {
    return this.node.name;
  }

  set name(name: string) {
    this.node.name = name;
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

  get page(): Page | undefined {
    const parentNode = this.node.parent;
    return parentNode && Page.from(parentNode);
  }

  get project(): Project {
    return this.node.project;
  }

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

  get selectable(): Selectable {
    return this.node.selectable;
  }

  get component(): Component | undefined {
    const parent = this.node.parent;
    if (!parent) {
      return;
    }
    return Component.from(parent);
  }

  get condition(): VariantCondition | undefined {
    return this.node.condition;
  }

  set condition(condition: VariantCondition | undefined) {
    this.node.condition = condition;
  }
}
