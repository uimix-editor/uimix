import { Component } from "@uimix/model/src/models/Component";
import * as HumanReadable from "./HumanReadableFormat";
import { Project } from "@uimix/model/src/models/Project";
import {
  NodeJSON,
  ProjectJSON,
  VariantCondition,
} from "@uimix/model/src/data/v1";
import { generateID } from "@uimix/foundation/src/utils/ID";

export class ComponentLoader {
  constructor(component: Component) {
    this.project = component.project;
    this.component = component;
  }

  readonly project: Project;
  readonly component: Component;
  projectJSON: ProjectJSON;

  load(node: HumanReadable.ComponentNode) {
    const componetNode: NodeJSON = {
      type: "component",
      name: node.props.id,
      parent: pageID,
      index: 0,
    };
    const id = generateID();

    this.projectJSON.nodes[id] = componetNode;

    for (const [i, childNode] of node.children.entries()) {
      if (childNode.type === "variant") {
        const id = generateID();

        this.projectJSON.nodes[id] = {
          type: "variant",
          condition: childNode.props.condition,
          parent: id,
          index: i,
        };
      } else {
        // TODO
      }
    }
  }
}

function loadComponent(
  projectJSON: ProjectJSON,
  component: HumanReadable.ComponentNode,
  parent: string,
  index: number
) {
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
      loadNode(projectJSON, variants, childNode, id, i);
    }
  }
}

function loadNode(
  projectJSON: ProjectJSON,
  variants: {
    id: string;
    condition: VariantCondition;
  }[],
  node: HumanReadable.SceneNode,
  parent: string,
  index: number
) {
  // TODO: reuse id if possible
  const id = generateID();

  projectJSON.nodes[id] = {
    type: "component",
    name: node.props.id,
    parent,
    index,
  };

  for (const [i, childNode] of node.children.entries()) {
    loadNode(projectJSON, variants, childNode, id, i);
  }
}
