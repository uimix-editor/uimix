import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { computed, makeObservable } from "mobx";
import { Component, ComponentJSON } from "./Component";
import { Element } from "./Element";
import { ElementInstance } from "./ElementInstance";
import { Text } from "./Text";
import { TextInstance } from "./TextInstance";
import { DefaultVariant, Variant } from "./Variant";

export class ComponentList extends TreeNode<never, ComponentList, Component> {
  get isUniqueNameRoot(): boolean {
    return true;
  }
}

export class Document {
  constructor() {
    makeObservable(this);
  }

  readonly components = new ComponentList();

  toJSON(): DocumentJSON {
    return {
      components: this.components.children.map((component) =>
        component.toJSON()
      ),
    };
  }

  loadJSON(json: DocumentJSON): void {
    const oldComponents = new Map<string, Component>();
    for (const component of this.components.children) {
      oldComponents.set(component.key, component);
    }

    this.components.clear();
    for (const componentJSON of json.components) {
      const component =
        oldComponents.get(componentJSON.key) ||
        new Component(componentJSON.key);
      component.loadJSON(componentJSON);
      this.components.append(component);
    }
  }

  @computed.struct get selectedInstances(): (ElementInstance | TextInstance)[] {
    return this.components.children.flatMap(
      (component) => component.selectedInstances
    );
  }

  @computed.struct get selectedVariants(): (Variant | DefaultVariant)[] {
    return this.components.children.flatMap(
      (component) => component.selectedVariants
    );
  }

  @computed.struct get selectedNodes(): (Element | Text)[] {
    return this.components.children.flatMap(
      (component) => component.selectedNodes
    );
  }

  @computed get selectedComponents(): Component[] {
    return this.components.children.filter((component) => component.selected);
  }

  deleteSelected(): void {
    for (const component of this.selectedComponents) {
      component.remove();
    }
    for (const variant of this.selectedVariants) {
      if (variant.type === "variant") {
        variant.component.variants.remove(variant);
      }
    }
    for (const node of this.selectedNodes) {
      if (!node.parent) {
        continue;
      }
      node.remove();
    }
  }
}

export interface DocumentJSON {
  components: ComponentJSON[];
}
