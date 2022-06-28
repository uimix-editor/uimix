import { assertNonNull } from "@seanchas116/paintkit/src/util/Assert";
import { last } from "lodash-es";
import { Component } from "../models/Component";
import { Element } from "../models/Element";
import { Fragment } from "../models/Fragment";
import { getInstance } from "../models/InstanceRegistry";
import { RootElement } from "../models/RootElement";
import { Text } from "../models/Text";
import { Variant } from "../models/Variant";
import { EditorState } from "../state/EditorState";

export function appendFragmentBeforeSelection(
  editorState: EditorState,
  fragment: Fragment
): void {
  switch (fragment.type) {
    case "components": {
      appendComponentsBeforeSelection(editorState, fragment.components);
      return;
    }
    case "variants": {
      appendVariantsBeforeSelection(editorState, fragment.variants);
      return;
    }
    case "instances": {
      appendNodesBeforeSelection(
        editorState,
        fragment.instances.map((i) => i.node)
      );
      return;
    }
  }
}

export function appendComponentsBeforeSelection(
  editorState: EditorState,
  components: Component[]
): void {
  const { document } = editorState;

  document.components.append(...components);
  document.deselect();
  for (const c of components) {
    c.select();
  }
  return;
}

export function appendVariantsBeforeSelection(
  editorState: EditorState,
  variants: Variant[]
): void {
  const { document } = editorState;

  let component: Component;
  let next: Variant | undefined;

  // selected directly or indirectly
  const selectedVariants = [...document.selectedInstances].map(
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
      last(document.selectedComponents) || document.components.lastChild;
    if (!component_) {
      return;
    }
    component = component_;
    next = undefined;
  }

  document.deselect();
  for (const variant of variants) {
    component.variants.insertBefore(variant, next as Variant);
    variant.rootInstance?.select();
  }
}

export function appendNodesBeforeSelection(
  editorState: EditorState,
  nodes: (Element | Text)[]
): void {
  const { document } = editorState;
  const { selectedComponents, selectedNodes } = document;
  let selectedNode = last(selectedNodes);

  if (!selectedNode && selectedComponents.length) {
    selectedNode =
      selectedComponents[selectedComponents.length - 1].rootElement;
  }

  if (!selectedNode) {
    const component = new Component();
    document.components.append(component);
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
    [...document.selectedInstances]
      .map((instance) => instance.variant)
      .reverse()
      .find((variant) => variant?.component === component) ||
    component.defaultVariant;

  document.deselect();

  for (const node of nodes) {
    parent.insertBefore(node, next);
    getInstance(variantToSelect, node).select();
  }
}
