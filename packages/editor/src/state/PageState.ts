import { computed, makeObservable } from "mobx";
import { Selectable } from "../models/Selectable";
import { ScrollState } from "./ScrollState";
import { Page } from "../models/Page";

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
    let pageState = pageStates.get(page);
    if (!pageState) {
      pageState = new PageState(page);
      pageStates.set(page, pageState);
    }
    return pageState;
  }
}

const pageStates = new WeakMap<Page, PageState>();
