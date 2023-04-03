import { Node } from "./Node";
import { Project } from "./Project";
import { Selectable } from "./Selectable";

export class Page {
  static from(node: Node): Page | undefined {
    if (node.type !== "page") {
      return;
    }
    return new Page(node);
  }

  private constructor(node: Node) {
    this.node = node;
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

  readonly node: Node;

  get selectable(): Selectable {
    return this.node.selectable;
  }

  get project(): Project {
    return this.node.project;
  }
}
