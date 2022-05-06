import { computed, makeObservable, observable } from "mobx";
import { Rect } from "paintvec";
import shortUUID from "short-uuid";
import type * as hast from "hast";
import { ElementInstance } from "./ElementInstance";
import { Text } from "./Text";
import { DefaultVariant, Variant } from "./Variant";
import { getInstance } from "./InstanceRegistry";

// Variant × Text
export class TextInstance {
  private constructor(variant: Variant | undefined, text: Text) {
    this._variant = variant;
    this.text = text;
    makeObservable(this);
  }

  readonly key = shortUUID.generate();

  get type(): "text" {
    return "text";
  }

  readonly _variant: Variant | undefined;

  get variant(): Variant | DefaultVariant | undefined {
    if (this._variant) {
      return this._variant;
    }

    const component = this.text.component;
    if (component) {
      return component.defaultVariant;
    }
  }

  readonly text: Text;

  get node(): Text {
    return this.text;
  }

  get parent(): ElementInstance | undefined {
    return this.text.parent
      ? getInstance(this.variant, this.text.parent)
      : undefined;
  }

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

  @observable.ref boundingBox: Rect = new Rect();

  get inFlow(): boolean {
    return true;
  }

  get outerHTML(): hast.Text {
    return this.text.outerHTML;
  }
}
