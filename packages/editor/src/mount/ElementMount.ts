import { reaction } from "mobx";
import { DOMElement } from "react";
import { Element } from "../models/Element";
import { Text } from "../models/Text";
import { Variant } from "../models/Variant";
import { MountRegistry } from "./MountRegistry";
import { TextMount } from "./TextMount";

export class ChildMountSync {
  constructor(
    element: Element,
    variant: Variant,
    dom: HTMLElement | SVGElement | ShadowRoot,
    registry: MountRegistry
  ) {
    this.element = element;
    this.variant = variant;
    this.dom = dom;
    this.registry = registry;
    this.updateChildren(element.children);
    this.disposers = [
      reaction(
        () => element.children,
        (children) => {
          this.updateChildren(children);
        }
      ),
    ];
  }

  private updateChildren(children: readonly (Element | Text)[]) {
    const existingElementMounts = new Map<Element, ElementMount>();
    const existingTextMounts = new Map<Text, TextMount>();

    for (const childMount of this.childMounts) {
      if (childMount instanceof ElementMount) {
        existingElementMounts.set(childMount.element, childMount);
      } else {
        existingTextMounts.set(childMount.text, childMount);
      }
    }

    const newChildMounts: (ElementMount | TextMount)[] = [];
    for (const child of children) {
      if (child instanceof Element) {
        const existingElementMount = existingElementMounts.get(child);
        if (existingElementMount) {
          newChildMounts.push(existingElementMount);
          existingElementMounts.delete(child);
        } else {
          newChildMounts.push(
            new ElementMount(child, this.variant, this.registry)
          );
        }
      } else {
        const existingTextMount = existingTextMounts.get(child);
        if (existingTextMount) {
          newChildMounts.push(existingTextMount);
          existingTextMounts.delete(child);
        } else {
          newChildMounts.push(
            new TextMount(child, this.variant, this.registry)
          );
        }
      }
    }

    for (const elementMount of existingElementMounts.values()) {
      elementMount.dispose();
    }
    for (const textMount of existingTextMounts.values()) {
      textMount.dispose();
    }
  }

  dispose(): void {}

  private readonly element: Element;
  private readonly variant: Variant;
  private readonly dom: HTMLElement | SVGElement | ShadowRoot;
  private readonly registry: MountRegistry;
  private childMounts: (ElementMount | TextMount)[] = [];
  private readonly disposers: (() => void)[] = [];
}

export class ElementMount {
  constructor(element: Element, variant: Variant, registry: MountRegistry) {
    this.element = element;
    this.variant = variant;
    // TODO: support reference to other component
    // TODO: support SVG elements
    this.dom = document.createElement(element.tagName);
    this.childMountSync = new ChildMountSync(
      element,
      variant,
      this.dom,
      registry
    );
    this.registry = registry;
    this.registry.setElementMount(this);
  }

  dispose(): void {
    this.childMountSync.dispose();
    this.registry.deleteElementMount(this);
  }

  readonly element: Element;
  readonly registry: MountRegistry;
  readonly variant: Variant;
  readonly dom: HTMLElement | SVGElement;
  readonly childMountSync: ChildMountSync;
}
