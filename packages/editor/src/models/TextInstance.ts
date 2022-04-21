import { Text } from "./Text";
import { Variant } from "./Variant";

// Variant × Text
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

  get type(): "text" {
    return "text";
  }

  readonly variant: Variant;
  readonly text: Text;
}
