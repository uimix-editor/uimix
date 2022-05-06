import { Element } from "./Element";
import { ElementInstance } from "./ElementInstance";
import { Text } from "./Text";
import { TextInstance } from "./TextInstance";
import { DefaultVariant, Variant } from "./Variant";

class InstanceRegistry {
  private instances = new WeakMap<
    Variant | DefaultVariant,
    WeakMap<Element | Text, ElementInstance | TextInstance>
  >();
  private defaultInstances = new WeakMap<
    Element | Text,
    ElementInstance | TextInstance
  >();

  get(
    variant: Variant | DefaultVariant | undefined,
    element: Element | Text
  ): ElementInstance | TextInstance {
    if (!variant || variant.type === "defaultVariant") {
      let instance = this.defaultInstances.get(element);
      if (!instance) {
        instance = this.createInstance(undefined, element);
        this.defaultInstances.set(element, instance);
      }
      return instance;
    }

    let instances = this.instances.get(variant);
    if (!instances) {
      instances = new WeakMap();
      this.instances.set(variant, instances);
    }
    let instance = instances.get(element);
    if (!instance) {
      instance = this.createInstance(variant, element);
      instances.set(element, instance);
    }
    return instance;
  }

  private createInstance(
    variant: Variant | undefined,
    node: Element | Text
  ): ElementInstance | TextInstance {
    if (node.type === "element") {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new ElementInstance(variant, node);
    } else {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new TextInstance(variant, node);
    }
  }
}

const instanceRegistry = new InstanceRegistry();

export function getInstance(
  variant: Variant | DefaultVariant | undefined,
  node: Element
): ElementInstance;
export function getInstance(
  variant: Variant | DefaultVariant | undefined,
  node: Text
): TextInstance;
export function getInstance(
  variant: Variant | DefaultVariant | undefined,
  node: Element | Text
): ElementInstance | TextInstance;
export function getInstance(
  variant: Variant | DefaultVariant | undefined,
  node: Element | Text
): ElementInstance | TextInstance {
  return instanceRegistry.get(variant, node);
}
