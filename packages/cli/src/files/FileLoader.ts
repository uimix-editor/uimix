import { Component } from "@uimix/model/src/models/Component";
import * as HumanReadable from "./HumanReadableFormat";
import { Project } from "@uimix/model/src/models/Project";
import {
  NodeJSON,
  ProjectJSON,
  VariantCondition,
} from "@uimix/model/src/data/v1";
import { generateID } from "@uimix/foundation/src/utils/ID";

function loadPage(
  projectJSON: ProjectJSON,
  page: HumanReadable.PageNode,
  index: number
) {
  // TODO: reuse id if possible
  const id = generateID();

  projectJSON.nodes[id] = {
    type: "page",
    name: "Page", // TODO
    parent: "project",
    index,
  };

  for (const [i, childNode] of page.children.entries()) {
    if (childNode.type === "component") {
      loadComponent(projectJSON, childNode, id, i);
      continue;
    }
    if (childNode.type === "colorToken") {
      // TODO
      continue;
    }
    loadNode(projectJSON, [], childNode, id, i);
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

  // TODO: load variants

  for (const [i, childNode] of node.children.entries()) {
    loadNode(projectJSON, variants, childNode, id, i);
  }
}
