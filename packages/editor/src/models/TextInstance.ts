import { computed, makeObservable, observable } from "mobx";
import { ElementInstance } from "./ElementInstance";
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
    makeObservable(this);
  }

  get type(): "text" {
    return "text";
  }

  get node(): Text {
    return this.text;
  }

  get parent(): ElementInstance | undefined {
    return this.text.parent
      ? ElementInstance.get(this.variant, this.text.parent)
      : undefined;
  }

  readonly variant: Variant;
  readonly text: Text;

  @observable selected = false;

  @computed get ancestorSelected(): boolean {
    return this.selected || this.parent?.ancestorSelected || false;
  }

  select(): void {
    this.selected = true;
  }

  deselect(): void {
    this.selected = false;
  }

  @computed get selectedDescendants(): TextInstance[] {
    return this.selected ? [this] : [];
  }
}
