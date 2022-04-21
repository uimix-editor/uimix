import { observable } from "mobx";
import { Component, ComponentJSON } from "./Component";

export class Document {
  readonly components = observable<Component>([]);

  toJSON(): DocumentJSON {
    return {
      components: this.components.map((component) => component.toJSON()),
    };
  }

  loadJSON(json: DocumentJSON): void {
    const oldComponents = new Map<string, Component>();
    for (const component of this.components) {
      oldComponents.set(component.key, component);
    }

    this.components.clear();
    for (const componentJSON of json.components) {
      const component =
        oldComponents.get(componentJSON.key) ||
        new Component(componentJSON.key);
      component.loadJSON(componentJSON);
      this.components.push(component);
    }
  }
}

export interface DocumentJSON {
  components: ComponentJSON[];
}
