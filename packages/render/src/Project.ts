import React from "react";
import { NodeJSON, ProjectJSON, StyleJSON } from "@uimix/node-data";
import {
  generateJSIdentifier,
  generateRefIDs,
  getIncrementalUniqueName,
} from "./name.js";
import { defaultStyle } from "./defaultStyle.js";

export interface Node extends NodeJSON {
  id: string;
  children: Node[];
}

export class Project {
  constructor(projectJSON: ProjectJSON) {
    this.nodeMap = new Map(
      Object.entries(projectJSON.nodes).map(([id, node]) => [
        id,
        { ...node, id, children: [] },
      ])
    );
    for (const node of this.nodeMap.values()) {
      if (node.parent) {
        const parent = this.nodeMap.get(node.parent);
        if (parent) {
          parent.children.push(node);
        }
      }
    }
    for (const node of this.nodeMap.values()) {
      node.children.sort((a, b) => a.index - b.index);
    }

    this.styleMap = new Map(Object.entries(projectJSON.styles));

    const componentNames = new Set<string>();

    for (const [id, node] of this.nodeMap) {
      if (node.type === "component") {
        const name = getIncrementalUniqueName(
          componentNames,
          generateJSIdentifier(node.name ?? "")
        );
        componentNames.add(name);

        const componentRenderer = new Component(this, id, name);
        this.components.set(id, componentRenderer);
      }
    }
  }

  nodeMap: Map<string, Node>;
  styleMap: Map<string, Partial<StyleJSON>>;

  components = new Map<string, Component>();

  getNode(id: string): Node | undefined {
    return this.nodeMap.get(id);
  }

  getComponentForID(id: string | null | undefined) {
    return id ? this.components.get(id) : undefined;
  }

  getStyle(idPath: string[]): StyleJSON {
    if (idPath.length === 0) {
      return defaultStyle;
    }

    const style = this.styleMap.get(idPath.join(":"));

    if (idPath.length === 1) {
      if (this.nodeMap.get(idPath[0])?.type === "instance") {
        const component = this.getComponentForID(style?.mainComponentID);
        if (component) {
          return {
            ...this.getStyle([component.rootNode.id]),
            ...style,
          };
        }
      } else {
        return {
          ...defaultStyle,
          ...style,
        };
      }
    }

    const superStyle = this.getStyle(idPath.slice(1));

    return {
      ...superStyle,
      ...style,
    };
  }
}

export class Component {
  constructor(project: Project, id: string, name: string) {
    this.project = project;
    this.id = id;
    this.name = name;

    const componentNode = this.project.nodeMap.get(this.id);
    if (!componentNode) {
      throw new Error("Node not found");
    }
    const rootNode = componentNode.children[0];
    if (!rootNode) {
      throw new Error("Root node not found");
    }
    this.componentNode = componentNode;
    this.rootNode = rootNode;

    this.refIDs = generateRefIDs(rootNode);
  }

  readonly project: Project;
  readonly id: string;
  readonly name: string;
  readonly componentNode: Node;
  readonly rootNode: Node;
  readonly refIDs: Map<string, string>;

  get variants(): Node[] {
    return this.componentNode.children.filter(
      (node) => node.type === "variant"
    );
  }
}
