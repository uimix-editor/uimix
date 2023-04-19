import * as HumanReadable from "./HumanReadableFormat";
import { ProjectJSON, VariantCondition } from "@uimix/model/src/data/v1";
import { generateID } from "@uimix/foundation/src/utils/ID";
import { getPageID } from "@uimix/model/src/data/util";

export class ProjectLoader {
  constructor(pages: Map<string, HumanReadable.PageNode>) {
    this.pages = pages;
  }

  pages: Map<string, HumanReadable.PageNode>;
  json: ProjectJSON = {
    nodes: {
      project: {
        type: "project",
        index: 0,
      },
    },
    styles: {},
    componentURLs: [],
    images: {},
    colors: {},
  };

  load(): void {
    for (const [name, page] of this.pages.entries()) {
      const pageLoader = new PageLoader(this, name, page);
      pageLoader.load();
    }
  }
}

class PageLoader {
  constructor(
    projectLoader: ProjectLoader,
    pageName: string,
    pageNode: HumanReadable.PageNode
  ) {
    this.projectLoader = projectLoader;
    this.pageName = pageName;
    this.pageNode = pageNode;
  }

  projectLoader: ProjectLoader;
  pageName: string;
  pageNode: HumanReadable.PageNode;

  load() {
    const projectJSON = this.projectLoader.json;
    const id = getPageID(this.pageName);

    projectJSON.nodes[id] = {
      type: "page",
      name: this.pageName,
      parent: "project",
      index: 0,
    };

    for (const [i, childNode] of this.pageNode.children.entries()) {
      if (childNode.type === "component") {
        this.loadComponent(childNode, id, i);
        continue;
      }
      if (childNode.type === "colorToken") {
        const colorID = generateID();
        projectJSON.colors[colorID] = {
          name: childNode.props.name,
          value: childNode.props.value,
          index: i,
          page: id,
        };
        continue;
      }
      this.loadNode([], childNode, id, i);
    }
  }

  loadComponent(
    component: HumanReadable.ComponentNode,
    parent: string,
    index: number
  ) {
    const projectJSON = this.projectLoader.json;

    // TODO: reuse id if possible
    const id = generateID();

    projectJSON.nodes[id] = {
      type: "component",
      name: component.props.id,
      parent,
      index,
    };

    const variants: {
      id: string;
      condition: VariantCondition;
    }[] = [];

    for (const [i, childNode] of component.children.entries()) {
      if (childNode.type === "variant") {
        const id = generateID();
        projectJSON.nodes[id] = {
          type: "variant",
          condition: childNode.props.condition,
          parent: id,
          index: i,
        };
        variants.push({ id, condition: childNode.props.condition });
      }
    }

    for (const [i, childNode] of component.children.entries()) {
      if (childNode.type !== "variant") {
        this.loadNode(variants, childNode, id, i);
      }
    }
  }

  loadNode(
    variants: {
      id: string;
      condition: VariantCondition;
    }[],
    node: HumanReadable.SceneNode,
    parent: string,
    index: number
  ) {
    const projectJSON = this.projectLoader.json;

    // TODO: reuse id if possible
    const id = generateID();

    projectJSON.nodes[id] = {
      type: node.type,
      name: node.props.id,
      parent,
      index,
    };

    // TODO: load variants

    for (const [i, childNode] of node.children.entries()) {
      this.loadNode(variants, childNode, id, i);
    }
  }
}
