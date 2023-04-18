import { Component } from "@uimix/model/src/models/Component";
import * as HumanReadable from "./HumanReadableFormat";
import { Project } from "@uimix/model/src/models/Project";

export class ComponentLoader {
  constructor(component: Component) {
    this.project = component.project;
    this.component = component;
  }

  readonly project: Project;
  readonly component: Component;

  load(node: HumanReadable.ComponentNode) {
    // TODO
  }
}
