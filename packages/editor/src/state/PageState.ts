import { computed, makeObservable } from "mobx";
import { Node } from "../models/Node";
import { Selectable } from "../models/Selectable";
import { ScrollState } from "./ScrollState";

export class PageState {
  constructor(pageNode: Node) {
    this.pageNode = pageNode;
    makeObservable(this);
  }

  readonly pageNode: Node;
  readonly scroll = new ScrollState();

  @computed get selectedSelectables(): Selectable[] {
    return (
      this.pageNode.selectable?.children.flatMap(
        (s) => s.selectedDescendants
      ) ?? []
    );
  }
}
