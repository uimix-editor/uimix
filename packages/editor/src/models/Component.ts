import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { computed, makeObservable, observable } from "mobx";
import { ComponentList } from "./Document";
import { Element, ElementJSON } from "./Element";
import { ElementInstance } from "./ElementInstance";
import { RootElement } from "./RootElement";
import { StyleJSON } from "./Style";
import { Text, TextJSON } from "./Text";
import { TextInstance } from "./TextInstance";
import { DefaultVariant, Variant, VariantJSON } from "./Variant";

export class VariantList extends TreeNode<never, VariantList, Variant> {
  constructor(component: Component) {
    super();
    this.component = component;
  }
  readonly component: Component;
}

export class Component extends TreeNode<ComponentList, Component, never> {
  constructor(key?: string) {
    super({ key });
    this.rename("my-component");
    makeObservable(this);
  }

  readonly rootElement = new RootElement(this);

  readonly defaultVariant = new DefaultVariant(this);
  readonly variants = new VariantList(this);
  get allVariants(): (Variant | DefaultVariant)[] {
    return [this.defaultVariant, ...this.variants.children];
  }

  get hasUniqueName(): boolean {
    return true;
  }

  @observable selected = false;

  select(): void {
    this.selected = true;
    for (const variant of this.allVariants) {
      variant.rootInstance?.deselect();
    }
  }

  deselect(): void {
    this.selected = false;
    for (const variant of this.allVariants) {
      variant.rootInstance?.deselect();
    }
  }

  @observable collapsed = true;

  toJSON(): ComponentJSON {
    const styles: Record<string, Record<string, StyleJSON>> = {}; // TODO

    for (const variant of this.allVariants) {
      const variantStyles: Record<string, StyleJSON> = {};

      for (const instance of variant.rootInstance?.allDescendants ?? []) {
        if (instance.type === "element") {
          variantStyles[instance.node.key] = instance.style.toJSON();
        }
      }

      styles[variant.key] = variantStyles;
    }

    return {
      key: this.key,
      name: this.name,
      variants: this.variants.children.map((variant) => variant.toJSON()),
      children: this.rootElement.children.map((child) => child.toJSON()),
      styles,
    };
  }

  loadJSON(json: ComponentJSON): void {
    if (json.key !== this.key) {
      throw new Error("Component key mismatch");
    }

    this.rename(json.name);

    const oldVariants = new Map<string, Variant>();
    for (const variant of this.variants.children) {
      oldVariants.set(variant.key, variant);
    }

    this.variants.clear();
    for (const variantJSON of json.variants) {
      const variant =
        oldVariants.get(variantJSON.key) || new Variant(variantJSON.key);
      variant.loadJSON(variantJSON);
      this.variants.append(variant);
    }

    this.rootElement.loadJSON({
      type: "element",
      key: this.rootElement.key,
      tagName: "div",
      id: "",
      attrs: {},
      children: json.children,
    });

    for (const variant of this.allVariants) {
      const variantStylesJSON = json.styles[variant.key];
      if (!variantStylesJSON) {
        continue;
      }

      for (const instance of variant.rootInstance?.allDescendants ?? []) {
        if (instance.type === "element") {
          const styleJSON = variantStylesJSON[instance.node.key];
          if (styleJSON) {
            instance.style.loadJSON(styleJSON);
          }
        }
      }
    }
  }

  @computed.struct get selectedInstances(): (ElementInstance | TextInstance)[] {
    if (this.selected) {
      return [];
    }

    return this.allVariants.flatMap(
      (v) => v.rootInstance?.selectedDescendants ?? []
    );
  }

  @computed.struct get selectedVariants(): (Variant | DefaultVariant)[] {
    if (this.selected) {
      return [];
    }

    return this.allVariants.filter((v) => v.rootInstance?.selected ?? false);
  }

  @computed.struct get selectedNodes(): (Element | Text)[] {
    if (this.selected) {
      return [];
    }

    // TODO: disallow selecting elements from multiple variants
    for (const variant of this.allVariants) {
      const selectedInstances = variant.rootInstance?.selectedDescendants;
      if (selectedInstances?.length) {
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
  styles: Record<
    string /* variant key */,
    Record<string /* element key */, StyleJSON>
  >;
}
