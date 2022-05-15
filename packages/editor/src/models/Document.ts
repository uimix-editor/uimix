import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { last } from "lodash-es";
import { computed, makeObservable, observable } from "mobx";
import { changeTagName } from "../services/ChangeTagName";
import { Component, ComponentJSON } from "./Component";
import { Element } from "./Element";
import { ElementInstance } from "./ElementInstance";
import { Fragment } from "./Fragment";
import { getInstance } from "./InstanceRegistry";
import { RootElement } from "./RootElement";
import { Text } from "./Text";
import { TextInstance } from "./TextInstance";
import { DefaultVariant, Variant } from "./Variant";

export class ComponentList extends TreeNode<never, ComponentList, Component> {
  constructor(document: Document) {
    super();
    this.document = document;
  }

  readonly document: Document;

  get isUniqueNameRoot(): boolean {
    return true;
  }

  forName(name: string): Component {
    return this.getDescendantByName(name) as Component;
  }
}

export class Document {
  constructor() {
    makeObservable(this);
  }

  readonly components = new ComponentList(this);

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

  @computed.struct get selectedElementInstances(): ElementInstance[] {
    return filterInstance(this.selectedInstances, [ElementInstance]);
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
    if (components.length) {
      return {
        type: "components",
        components,
      };
    }
    const variants = filterInstance(this.selectedVariants, [Variant]);
    if (variants.length) {
      return {
        type: "variants",
        variants,
      };
    }
    const instances = this.selectedInstances;
    if (instances.length) {
      return {
        type: "instances",
        instances,
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
        this.appendComponentsBeforeSelection(fragment.components);
        return;
      }
      case "variants": {
        this.appendVariantsBeforeSelection(fragment.variants);
        return;
      }
      case "instances": {
        this.appendNodesBeforeSelection(fragment.instances.map((i) => i.node));
        return;
      }
    }
  }

  appendComponentsBeforeSelection(components: Component[]): void {
    this.components.append(...components);
    this.deselect();
    for (const c of components) {
      c.select();
    }
    return;
  }

  appendVariantsBeforeSelection(variants: Variant[]): void {
    let component: Component;
    let next: Variant | undefined;

    // selected directly or indirectly
    const selectedVariants = [...this.selectedInstances].map(
      (instance) => instance.variant
    );

    if (selectedVariants.length) {
      const last = assertNonNull(selectedVariants[selectedVariants.length - 1]);
      component = assertNonNull(last.component);
      next =
        last.type === "defaultVariant"
          ? component.variants.firstChild
          : (last.nextSibling as Variant);
    } else {
      const component_ =
        last(this.selectedComponents) || this.components.lastChild;
      if (!component_) {
        return;
      }
      component = component_;
      next = undefined;
    }

    this.deselect();
    for (const variant of variants) {
      component.variants.insertBefore(variant, next as Variant);
      variant.rootInstance?.select();
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
        .find((variant) => variant?.component === component) ||
      component.defaultVariant;

    this.deselect();

    for (const node of nodes) {
      parent.insertBefore(node, next);
      getInstance(variantToSelect, node).select();
    }
  }

  deleteSelected(): void {
    for (const component of this.selectedComponents) {
      component.remove();
    }
    for (const variant of this.selectedVariants) {
      if (variant.type === "defaultVariant") {
        variant.component.remove();
      } else {
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

  renameTagNameUsages(oldTagName: string, newTagName: string): void {
    const elementsToRename: Element[] = [];

    const findElements = (element: Element) => {
      if (element.parent && element.tagName === oldTagName) {
        elementsToRename.push(element);
      }
      for (const child of element.children) {
        if (child.type === "element") {
          findElements(child);
        }
      }
    };

    for (const component of this.components.children) {
      findElements(component.rootElement);
    }

    for (const element of elementsToRename) {
      changeTagName(element, newTagName);
    }
  }

  readonly preludeScripts = observable.array<string>(["./shoelace.js"]);
  readonly loadedCustomElements = observable.set<string>();
}

export interface DocumentJSON {
  components: ComponentJSON[];
}
