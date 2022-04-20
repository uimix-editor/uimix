import { reaction } from "mobx";
import { Element } from "../models/Element";
import { Text } from "../models/Text";
import { TextMount } from "./TextMount";

export class ElementMount {
  constructor(element: Element) {
    this.element = element;
    // TODO: support reference to other component
    // TODO: support SVG elements
    this.dom = document.createElement(element.tagName);

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

  dispose(): void {
    this.disposers.forEach((disposer) => disposer());
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
          newChildMounts.push(new ElementMount(child));
        }
      } else {
        const existingTextMount = existingTextMounts.get(child);
        if (existingTextMount) {
          newChildMounts.push(existingTextMount);
          existingTextMounts.delete(child);
        } else {
          newChildMounts.push(new TextMount(child));
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
  private readonly disposers: (() => void)[] = [];
  private childMounts: (ElementMount | TextMount)[] = [];
}
