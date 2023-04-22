import { Node } from "./Node";
import { computed, makeObservable } from "mobx";
import { Page } from "./Page";
import { compact } from "lodash-es";
import { assertNonNull } from "@uimix/foundation/src/utils/Assert";
import { Project } from "./Project";
import { getPageID } from "../data/util";

export class PageList {
  constructor(project: Project) {
    this.project = project;
    this.node = project.node;
    makeObservable(this);
  }

  node: Node;
  readonly project: Project;

  @computed get count(): number {
    return this.node.childCount;
  }

  get all(): Page[] {
    return compact(this.node.children.map((node) => Page.from(node)));
  }

  create(filePath: string): Page {
    const id = getPageID(filePath);
    const node = this.project.nodes.create("page", id);
    node.name = filePath;
    this.node.append([node]);
    const page = assertNonNull(Page.from(node));
    return page;
  }
}
