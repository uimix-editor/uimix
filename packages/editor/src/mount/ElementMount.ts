import { reaction } from "mobx";
import { Element } from "../models/Element";
import { Text } from "../models/Text";
import { MountRegistry } from "./MountRegistry";
import { TextMount } from "./TextMount";

export class ElementMount {
  constructor(element: Element, registry: MountRegistry) {
    this.element = element;
    // TODO: support reference to other component
    // TODO: support SVG elements
    this.dom = document.createElement(element.tagName);
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
    this.registry.addElementMount(element, this);
  }

  dispose(): void {
    this.disposers.forEach((disposer) => disposer());
    this.registry.removeElementMount(this.element, this);
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
          newChildMounts.push(new ElementMount(child, this.registry));
        }
      } else {
        const existingTextMount = existingTextMounts.get(child);
        if (existingTextMount) {
          newChildMounts.push(existingTextMount);
          existingTextMounts.delete(child);
        } else {
          newChildMounts.push(new TextMount(child, this.registry));
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

  readonly element: Element;
  readonly dom: HTMLElement | SVGElement;
  readonly registry: MountRegistry;
  private readonly disposers: (() => void)[] = [];
  private childMounts: (ElementMount | TextMount)[] = [];
}
