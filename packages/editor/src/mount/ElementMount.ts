import { reaction } from "mobx";
import { Element } from "../models/Element";
import { Text } from "../models/Text";

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
    throw new Error("TODO");
  }

  readonly element: Element;
  readonly dom: HTMLElement | SVGElement;
  private readonly disposers: (() => void)[] = [];
}
