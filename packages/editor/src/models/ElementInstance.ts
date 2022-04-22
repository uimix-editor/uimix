import { Element } from "./Element";
import { TextInstance } from "./TextInstance";
import { Variant } from "./Variant";

// Variant × Element
export class ElementInstance {
  private static instances = new WeakMap<
    Variant,
    WeakMap<Element, ElementInstance>
  >();

  static get(variant: Variant, element: Element): ElementInstance {
    let instances = this.instances.get(variant);
    if (!instances) {
      instances = new WeakMap();
      ElementInstance.instances.set(variant, instances);
    }
    let instance = instances.get(element);
    if (!instance) {
      instance = new ElementInstance(variant, element);
      instances.set(element, instance);
    }
    return instance;
  }

  private constructor(variant: Variant, element: Element) {
    this.variant = variant;
    this.element = element;
  }

  get type(): "element" {
    return "element";
  }

  readonly variant: Variant;
  readonly element: Element;

  get children(): readonly (ElementInstance | TextInstance)[] {
    return this.element.children.map((child) =>
      child.type === "element"
        ? ElementInstance.get(this.variant, child)
        : TextInstance.get(this.variant, child)
    );
  }
}
