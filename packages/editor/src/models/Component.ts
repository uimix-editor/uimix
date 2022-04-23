import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { computed, makeObservable, observable } from "mobx";
import { ComponentList } from "./Document";
import { Element, ElementJSON } from "./Element";
import { RootElement } from "./RootElement";
import { Text, TextJSON } from "./Text";
import { Variant, VariantJSON } from "./Variant";

export class Component extends TreeNode<ComponentList, Component, never> {
  constructor(key?: string) {
    super({ key });
    this.rename("my-component");
    makeObservable(this);
  }

  readonly rootElement = new RootElement(this);

  readonly defaultVariant = new Variant(this);
  readonly variants = observable<Variant>([]);
  get allVariants(): Variant[] {
    return [this.defaultVariant, ...this.variants];
  }

  get hasUniqueName(): boolean {
    return true;
  }

  @observable selected = false;

  select(): void {
    this.selected = true;
    for (const variant of this.allVariants) {
      variant.rootInstance.deselect();
    }
  }

  deselect(): void {
    this.selected = false;
    for (const variant of this.allVariants) {
      variant.rootInstance.deselect();
    }
  }

  @observable collapsed = true;

  toJSON(): ComponentJSON {
    return {
      key: this.key,
      name: this.name,
      variants: this.variants.map((variant) => variant.toJSON()),
      children: this.rootElement.children.map((child) => child.toJSON()),
    };
  }

  loadJSON(json: ComponentJSON): void {
    if (json.key !== this.key) {
      throw new Error("Component key mismatch");
    }

    this.rename(json.name);

    const oldVariants = new Map<string, Variant>();
    for (const variant of this.variants) {
      oldVariants.set(variant.key, variant);
    }

    this.variants.clear();
    for (const variantJSON of json.variants) {
      const variant =
        oldVariants.get(variantJSON.key) || new Variant(this, variantJSON.key);
      variant.loadJSON(variantJSON);
      this.variants.push(variant);
    }

    this.rootElement.loadJSON({
      type: "element",
      key: this.rootElement.key,
      tagName: "div",
      id: "",
      attrs: {},
      children: json.children,
    });
  }

  @computed get selectedNodes(): (Element | Text)[] {
    // TODO: disallow selecting elements from multiple variants
    for (const variant of this.allVariants) {
      const selectedInstances = variant.rootInstance.selectedDescendants;
      if (selectedInstances.length) {
        return selectedInstances.map((instance) => instance.node);
      }
    }
    return [];
  }
}

export interface ComponentJSON {
  key: string;
  name: string;
  variants: VariantJSON[];
  children: (ElementJSON | TextJSON)[];
}
