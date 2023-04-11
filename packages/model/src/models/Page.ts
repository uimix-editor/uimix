import { getOrCreate } from "@uimix/foundation/src/utils/Collection";
import { Node } from "./Node";
import { Project } from "./Project";
import { Selectable } from "./Selectable";
import { Component } from "./Component";
import { ColorTokenList } from "./ColorToken";

const instances = new WeakMap<Node, Page>();

export class Page {
  static from(node: Node): Page | undefined {
    if (node.type !== "page") {
      return;
    }
    return getOrCreate(instances, node, () => new Page(node));
  }

  private constructor(node: Node) {
    this.node = node;
    this.colorTokens = new ColorTokenList(this);
  }

  readonly colorTokens: ColorTokenList;

  get id(): string {
    return this.node.id;
  }

  get filePath(): string {
    return this.node.name;
  }

  readonly node: Node;

  get selectable(): Selectable {
    return this.node.selectable;
  }

  get project(): Project {
    return this.node.project;
  }

  get components(): Component[] {
    const components: Component[] = [];

    for (const node of this.node.children) {
      const component = Component.from(node);
      if (component) {
        components.push(component);
      }
    }

    return components;
  }
}
