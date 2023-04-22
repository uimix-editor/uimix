import { Node } from "./Node";
import { computed, makeObservable } from "mobx";
import { Page } from "./Page";
import { compact } from "lodash-es";
import { assertNonNull } from "@uimix/foundation/src/utils/Assert";
import { Project } from "./Project";
import { getPageID } from "../data/util";
import { PathHierarchyFolder, PathHierarchy } from "./PathHierarchy";

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

  toHierarchy(): PathHierarchyFolder<Page> {
    return PathHierarchy.build(this.all);
  }

  delete(path: string): Page[] {
    const deletedPages = PathHierarchy.targetsForPath(this.all, path);

    for (const page of deletedPages) {
      page.node.remove();
      // TODO: delete dangling nodes?
      //this.project.nodes.remove(doc.root);
    }

    return deletedPages;
  }

  rename(
    path: string,
    newPath: string
  ): {
    originalPages: Page[];
    newPages: Page[];
  } {
    if (path === newPath) {
      return {
        originalPages: [],
        newPages: [],
      };
    }

    const originalPages = PathHierarchy.targetsForPath(this.all, path);
    const newPages: Page[] = [];

    for (const page of originalPages) {
      const newName = newPath + page.filePath.slice(path.length);
      const newPage = this.create(newName);
      newPage.node.append(page.node.children);
      newPages.push(newPage);
    }

    for (const page of originalPages) {
      page.node.remove();
    }

    return {
      originalPages,
      newPages,
    };
  }
}
