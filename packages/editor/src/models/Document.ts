import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { last } from "lodash-es";
import { computed, makeObservable } from "mobx";
import { Component, ComponentJSON } from "./Component";
import { Element } from "./Element";
import { ElementInstance } from "./ElementInstance";
import { Fragment } from "./Fragment";
import { RootElement } from "./RootElement";
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

  @computed get selectedFragment(): Fragment | undefined {
    const components = this.selectedComponents;
    if (components.length === 1) {
      return {
        type: "components",
        components: components,
      };
    }
    const variants = filterInstance(this.selectedVariants, [Variant]);
    if (variants.length === 1) {
      return {
        type: "variants",
        variants: variants,
      };
    }
    const nodes = this.selectedNodes;
    if (nodes.length === 1) {
      return {
        type: "nodes",
        nodes: nodes,
      };
    }
  }

  deselect(): void {
    for (const component of this.components.children) {
      component.deselect();
      for (const variant of component.allVariants) {
        variant.rootInstance?.deselect();
      }
    }
  }

  appendFragmentBeforeSelection(fragment: Fragment): void {
    switch (fragment.type) {
      case "components": {
        this.components.append(...fragment.components);
        this.deselect();
        for (const c of fragment.components) {
          c.select();
        }
        return;
      }
      case "variants": {
        const prev = last(this.selectedVariants);
        if (prev && prev.component) {
          const component = prev.component;
          const next =
            prev.type === "defaultVariant"
              ? component.variants.firstChild
              : prev.nextSibling;

          for (const variant of fragment.variants) {
            component.variants.insertBefore(variant, next as Variant);
          }
        }
        return;
      }
      case "nodes": {
        this.appendNodesBeforeSelection(fragment.nodes);
        return;
      }
    }
  }

  appendNodesBeforeSelection(nodes: (Element | Text)[]): void {
    const { selectedComponents, selectedNodes } = this;
    let selectedNode = last(selectedNodes);

    if (!selectedNode && selectedComponents.length) {
      selectedNode =
        selectedComponents[selectedComponents.length - 1].rootElement;
    }

    if (!selectedNode) {
      const component = new Component();
      this.components.append(component);
      selectedNode = component.rootElement;
    }

    let parent: Element;
    let next: Element | Text | undefined;

    if (selectedNode.parent) {
      parent = selectedNode.parent;
      next = selectedNode.nextSibling;
    } else if (selectedNode instanceof RootElement) {
      parent = selectedNode;
      next = undefined;
    } else {
      return;
    }

    const component = assertNonNull(parent.component);

    const variantToSelect =
      [...this.selectedInstances]
        .map((instance) => instance.variant)
        .reverse()
        .find((variant) => variant.component === component) ||
      component.defaultVariant;

    this.deselect();

    for (const node of nodes) {
      parent.insertBefore(node, next);

      if (node.type === "element") {
        ElementInstance.get(variantToSelect, node).select();
      } else {
        TextInstance.get(variantToSelect, node).select();
      }
    }
  }

  deleteSelected(): void {
    for (const component of this.selectedComponents) {
      component.remove();
    }
    for (const variant of this.selectedVariants) {
      if (variant.type === "variant") {
        variant.remove();
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
