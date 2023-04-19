import { Component, Node, Page, Project } from "@uimix/model/src/models";
import * as HumanReadable from "./HumanReadableFormat";

export class ProjectLoader2 {
  constructor() {
    this.project = new Project();
  }

  project: Project;

  load(files: Map<string, HumanReadable.PageNode>) {
    const pageLoaders: PageLoader[] = [];

    for (const [pageName, pageNode] of files) {
      const page = this.project.pages.create(pageName);
      const pageLoader = new PageLoader(this, page);
      pageLoader.load(pageNode);
      pageLoaders.push(pageLoader);
    }

    for (const pageLoader of pageLoaders) {
      pageLoader.loadStyles();
    }
  }
}

class PageLoader {
  constructor(projectLoader: ProjectLoader2, page: Page) {
    this.projectLoader = projectLoader;
    this.page = page;
  }

  projectLoader: ProjectLoader2;
  page: Page;

  get project() {
    return this.page.project;
  }

  load(inputNode: HumanReadable.PageNode) {
    const children: Node[] = [];

    for (const inputChild of inputNode.children) {
      if (inputChild.type === "colorToken") {
        // TODO: color token
      } else if (inputChild.type === "component") {
        children.push(this.loadComponent(inputChild));
      } else {
        children.push(this.loadNode(inputChild));
      }
    }

    this.page.node.append(children);
  }

  loadNode(inputNode: HumanReadable.SceneNode): Node {
    const node = this.project.nodes.create(inputNode.type);
    const children = inputNode.children.map((child) => this.loadNode(child));
    node.append(children);

    // TODO: load styles (after all node structures are loaded)
    return node;
  }

  loadComponent(inputNode: HumanReadable.ComponentNode): Node {
    const componentNode = this.project.nodes.create("component");

    const children = inputNode.children.map((child) => {
      if (child.type === "variant") {
        const variantNode = this.project.nodes.create("variant");
        variantNode.condition = child.props.condition;
        return variantNode;
      } else {
        return this.loadNode(child);
      }
    });

    // TODO: bulk append
    for (const child of children) {
      componentNode.append([child]);
    }
    return componentNode;
  }

  loadStyles() {
    // TODO
  }
}
