import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { computed, makeObservable, observable } from "mobx";
import { ComponentMetadata } from "./ComponentMetadata";
import { ComponentList, Document } from "./Document";
import { Element, ElementJSON } from "./Element";
import { ElementInstance } from "./ElementInstance";
import { RootElement } from "./RootElement";
import { StyleJSON } from "./Style";
import { Text, TextJSON } from "./Text";
import { TextInstance } from "./TextInstance";
import {
  BaseVariantJSON,
  DefaultVariant,
  Variant,
  VariantJSON,
} from "./Variant";

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
    makeObservable(this);
    this.rename("my-component");
    this.defaultVariant.rootInstance.style.display = "block";
  }

  get document(): Document | undefined {
    return this.parent?.document;
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

  rename(name: string): void {
    const oldName = this.name;
    super.rename(name);
    const newName = this.name;
    this.document?.renameTagNameUsages(oldName, newName);
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
          variantStyles[
            instance === variant.rootInstance ? "" : instance.node.key
          ] = instance.style.toJSON();
        }
      }

      styles[variant.type === "defaultVariant" ? "" : variant.key] =
        variantStyles;
    }

    return {
      key: this.key,
      name: this.name,
      defaultVariant: this.defaultVariant.toJSON(),
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

    this.defaultVariant.loadJSON(json.defaultVariant);

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
      const variantStylesJSON =
        json.styles[variant.type === "defaultVariant" ? "" : variant.key];
      if (!variantStylesJSON) {
        continue;
      }

      for (const instance of variant.rootInstance?.allDescendants ?? []) {
        if (instance.type === "element") {
          const styleJSON =
            variantStylesJSON[
              instance === variant.rootInstance ? "" : instance.node.key
            ];
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

  @observable thumbnail?: string = undefined;

  @computed.struct get usedFontFamilies(): Set<string> {
    const families = new Set<string>();

    for (const variant of this.allVariants) {
      for (const family of variant.rootInstance?.usedFontFamilies ??
        new Set()) {
        families.add(family);
      }
    }

    return families;
  }

  @computed get usedCSSVariables(): Set<string> {
    const usedVariables = new Set<string>();

    const visitInstance = (instance: ElementInstance): void => {
      for (const key in instance.style.usedCSSVariables) {
        usedVariables.add(key);
      }

      for (const child of instance.children) {
        if (child.type === "element") {
          visitInstance(child);
        }
      }
    };

    for (const variant of this.allVariants) {
      visitInstance(variant.rootInstance!);
    }

    return usedVariables;
  }

  get metadata(): ComponentMetadata {
    return {
      name: this.name,
      thumbnail: this.thumbnail,
      cssVariables: [...this.usedCSSVariables],
    };
  }
}

export interface ComponentJSON {
  key: string;
  name: string;
  defaultVariant: BaseVariantJSON;
  variants: VariantJSON[];
  children: (ElementJSON | TextJSON)[];
  styles: Record<
    string /* variant key */,
    Record<string /* element key */, StyleJSON>
  >;
}
