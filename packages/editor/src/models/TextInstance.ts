import { computed, makeObservable, observable } from "mobx";
import shortUUID from "short-uuid";
import { ElementInstance } from "./ElementInstance";
import { Text } from "./Text";
import { DefaultVariant, Variant } from "./Variant";

// Variant × Text
export class TextInstance {
  private static instances = new WeakMap<
    Variant | DefaultVariant,
    WeakMap<Text, TextInstance>
  >();

  readonly key = shortUUID.generate();

  static get(variant: Variant | DefaultVariant, text: Text): TextInstance {
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

  private constructor(variant: Variant | DefaultVariant, text: Text) {
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

  readonly variant: Variant | DefaultVariant;
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

  expandAncestors(): void {
    this.parent?.expandAncestors();
  }

  @computed get allDescendants(): (ElementInstance | TextInstance)[] {
    return [this];
  }
}
