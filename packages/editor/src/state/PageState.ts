import { computed, makeObservable } from "mobx";
import { Selectable } from "../models/Selectable";
import { ScrollState } from "./ScrollState";
import { Page } from "../models/Page";
import { Node } from "../models/Node";

export class PageState {
  constructor(page: Page) {
    this.page = page;
    makeObservable(this);
  }

  readonly page: Page;
  readonly scroll = new ScrollState();

  @computed get selectedSelectables(): Selectable[] {
    return (
      this.page.node.selectable?.children.flatMap(
        (s) => s.selectedDescendants
      ) ?? []
    );
  }

  static from(page: Page): PageState {
    let pageState = pageStates.get(page.node);
    if (!pageState) {
      pageState = new PageState(page);
      pageStates.set(page.node, pageState);
    }
    return pageState;
  }
}

const pageStates = new WeakMap<Node, PageState>();
