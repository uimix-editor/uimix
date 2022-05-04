import { computed, makeObservable, observable } from "mobx";
import { Rect } from "paintvec";
import shortUUID from "short-uuid";
import { Element } from "./Element";
import { RootElement } from "./RootElement";
import { Style } from "./Style";
import { TextInstance } from "./TextInstance";
import { DefaultVariant, Variant } from "./Variant";

// Variant × Element
export class ElementInstance {
  private static instances = new WeakMap<
    Variant | DefaultVariant,
    WeakMap<Element, ElementInstance>
  >();

  readonly key = shortUUID.generate();

  static get(
    variant: Variant | DefaultVariant,
    element: Element
  ): ElementInstance {
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

  private constructor(variant: Variant | DefaultVariant, element: Element) {
    this.variant = variant;
    this.element = element;
    makeObservable(this);
  }

  get type(): "element" {
    return "element";
  }

  readonly variant: Variant | DefaultVariant;
  readonly element: Element;

  get node(): Element {
    return this.element;
  }

  get parent(): ElementInstance | undefined {
    return this.element.parent
      ? ElementInstance.get(this.variant, this.element.parent)
      : undefined;
  }

  get offsetParentOfChildren(): ElementInstance {
    if (!this.parent || this.computedStyle.position !== "static") {
      return this;
    }
    return this.parent.offsetParentOfChildren;
  }

  get offsetParent(): ElementInstance | undefined {
    return this.parent?.offsetParentOfChildren;
  }

  get ancestors(): readonly ElementInstance[] {
    const result: ElementInstance[] = [];
    let current: ElementInstance | undefined = this;
    while (current) {
      result.unshift(current);
      current = current.parent;
    }
    return result;
  }

  get children(): readonly (ElementInstance | TextInstance)[] {
    return this.element.children.map((child) =>
      child.type === "element"
        ? ElementInstance.get(this.variant, child)
        : TextInstance.get(this.variant, child)
    );
  }

  readonly style = new Style();
  readonly computedStyle = new Style();

  @observable selected = false;

  @computed get ancestorSelected(): boolean {
    return this.selected || this.parent?.ancestorSelected || false;
  }

  select(): void {
    this.selected = true;
    for (const child of this.children) {
      child.deselect();
    }
  }

  deselect(): void {
    this.selected = false;
    for (const child of this.children) {
      child.deselect();
    }
  }

  @computed.struct get selectedDescendants(): (
    | ElementInstance
    | TextInstance
  )[] {
    if (this.selected) {
      return [this];
    }
    return this.children.flatMap((child) => child.selectedDescendants);
  }

  @observable collapsed = true;

  expandAncestors(): void {
    this.collapsed = false;
    if (this.parent) {
      this.parent.expandAncestors();
    } else if (this.element instanceof RootElement) {
      this.element.component.collapsed = false;
    }
  }

  @observable.ref boundingBox: Rect = new Rect();

  @computed get offsetBoundingBox(): Rect {
    const { offsetParent } = this;
    if (offsetParent) {
      return this.boundingBox.translate(offsetParent.boundingBox.topLeft.neg);
    }
    return this.boundingBox;
  }

  @computed get computedPaddings(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    return {
      top: Number.parseFloat(this.computedStyle.paddingTop ?? "0"),
      right: Number.parseFloat(this.computedStyle.paddingRight ?? "0"),
      bottom: Number.parseFloat(this.computedStyle.paddingBottom ?? "0"),
      left: Number.parseFloat(this.computedStyle.paddingLeft ?? "0"),
    };
  }

  @computed get allDescendants(): (ElementInstance | TextInstance)[] {
    return [this, ...this.children.flatMap((child) => child.allDescendants)];
  }
}
