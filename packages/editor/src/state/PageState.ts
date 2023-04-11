import { computed, makeObservable } from "mobx";
import { ScrollState } from "./ScrollState";
import { Page, Selectable } from "@uimix/model/src/models";
import { getOrCreate } from "@uimix/foundation/src/utils/Collection";

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
    return getOrCreate(pageStates, page, () => new PageState(page));
  }
}

const pageStates = new WeakMap<Page, PageState>();
