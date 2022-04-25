import { reaction } from "mobx";
import { Element } from "../models/Element";
import { Text } from "../models/Text";
import { ElementInstance } from "../models/ElementInstance";
import { TextInstance } from "../models/TextInstance";
import { MountRegistry } from "./MountRegistry";
import { TextMount } from "./TextMount";

export class ChildMountSync {
  constructor(
    instance: ElementInstance,
    registry: MountRegistry,
    dom: HTMLElement | SVGElement | ShadowRoot
  ) {
    this.instance = instance;
    this.dom = dom;
    this.registry = registry;
    this.updateChildren(instance.element.children);
    this.disposers = [
      reaction(
        () => instance.element.children,
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
      if (childMount.type === "element") {
        existingElementMounts.set(childMount.instance.element, childMount);
      } else {
        existingTextMounts.set(childMount.instance.text, childMount);
      }
    }

    const newChildMounts: (ElementMount | TextMount)[] = [];
    for (const child of children) {
      if (child.type === "element") {
        const existingElementMount = existingElementMounts.get(child);
        if (existingElementMount) {
          newChildMounts.push(existingElementMount);
          existingElementMounts.delete(child);
        } else {
          newChildMounts.push(
            new ElementMount(
              ElementInstance.get(this.instance.variant, child),
              this.registry,
              this.dom.ownerDocument
            )
          );
        }
      } else {
        const existingTextMount = existingTextMounts.get(child);
        if (existingTextMount) {
          newChildMounts.push(existingTextMount);
          existingTextMounts.delete(child);
        } else {
          newChildMounts.push(
            new TextMount(
              TextInstance.get(this.instance.variant, child),
              this.registry,
              this.dom.ownerDocument
            )
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

    while (this.dom.firstChild) {
      this.dom.firstChild.remove();
    }
    for (const childMount of newChildMounts) {
      this.dom.append(childMount.dom);
    }
  }

  dispose(): void {
    this.disposers.forEach((disposer) => disposer());
    this.childMounts.forEach((childMount) => childMount.dispose());
  }

  private readonly instance: ElementInstance;
  private readonly dom: HTMLElement | SVGElement | ShadowRoot;
  private readonly registry: MountRegistry;
  private childMounts: (ElementMount | TextMount)[] = [];
  private readonly disposers: (() => void)[] = [];
}

export class ElementMount {
  constructor(
    instance: ElementInstance,
    registry: MountRegistry,
    domDocument: globalThis.Document
  ) {
    this.instance = instance;
    // TODO: support reference to other component
    // TODO: support SVG elements
    this.dom = domDocument.createElement(instance.element.tagName);
    this.childMountSync = new ChildMountSync(instance, registry, this.dom);
    this.registry = registry;
    this.registry.setElementMount(this);
    this.domDocument = domDocument;

    this.disposers.push(
      reaction(
        () => this.instance.element.id,
        (id) => {
          this.dom.id = id;
        },
        { fireImmediately: true }
      )
    );
  }

  dispose(): void {
    if (this.isDisposed) {
      throw new Error("ElementMount is already disposed");
    }

    this.disposers.forEach((disposer) => disposer());
    this.childMountSync.dispose();
    this.registry.deleteElementMount(this);

    this.isDisposed = true;
  }

  get type(): "element" {
    return "element";
  }

  private isDisposed = false;
  private readonly disposers: (() => void)[] = [];
  readonly instance: ElementInstance;
  readonly registry: MountRegistry;
  readonly domDocument: globalThis.Document;
  readonly dom: HTMLElement | SVGElement;
  private readonly childMountSync: ChildMountSync;
}
