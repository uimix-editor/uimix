import { Element } from "./Element";
import { Text } from "./Text";
import { Variant } from "./Variant";

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

  readonly variant: Variant;
  readonly element: Element;
}

export class TextInstance {
  private static instances = new WeakMap<
    Variant,
    WeakMap<Text, TextInstance>
  >();

  static get(variant: Variant, text: Text): TextInstance {
    let instances = this.instances.get(variant);
    if (!instances) {
      instances = new WeakMap();
      TextInstance.instances.set(variant, instances);
    }
    let instance = instances.get(text);
    if (!instance) {
      instance = new TextInstance(variant, text);
      instances.set(text, instance);
    }
    return instance;
  }

  private constructor(variant: Variant, text: Text) {
    this.variant = variant;
    this.text = text;
  }

  readonly variant: Variant;
  readonly text: Text;
}
