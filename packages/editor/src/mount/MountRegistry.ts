import { Element } from "../models/Element";
import { Text } from "../models/Text";
import { ElementMount } from "./ElementMount";
import { TextMount } from "./TextMount";

export class MountRegistry {
  private readonly elementMounts = new WeakMap<Element, Set<ElementMount>>();
  private readonly textMounts = new WeakMap<Text, Set<TextMount>>();

  addElementMount(element: Element, elementMount: ElementMount): void {
    let elementMounts = this.elementMounts.get(element);
    if (!elementMounts) {
      elementMounts = new Set();
      this.elementMounts.set(element, elementMounts);
    }
    elementMounts.add(elementMount);
  }

  addTextMount(text: Text, textMount: TextMount): void {
    let textMounts = this.textMounts.get(text);
    if (!textMounts) {
      textMounts = new Set();
      this.textMounts.set(text, textMounts);
    }
    textMounts.add(textMount);
  }

  removeElementMount(element: Element, elementMount: ElementMount): void {
    const elementMounts = this.elementMounts.get(element);
    if (elementMounts) {
      elementMounts.delete(elementMount);
      if (elementMounts.size === 0) {
        this.elementMounts.delete(element);
      }
    }
  }

  removeTextMount(text: Text, textMount: TextMount): void {
    const textMounts = this.textMounts.get(text);
    if (textMounts) {
      textMounts.delete(textMount);
      if (textMounts.size === 0) {
        this.textMounts.delete(text);
      }
    }
  }

  getElementMount(element: Element): ElementMount | undefined {
    const elementMounts = this.elementMounts.get(element);
    if (elementMounts) {
      return elementMounts.values().next().value;
    }
    return undefined;
  }

  getTextMount(text: Text): TextMount | undefined {
    const textMounts = this.textMounts.get(text);
    if (textMounts) {
      return textMounts.values().next().value;
    }
    return undefined;
  }
}
