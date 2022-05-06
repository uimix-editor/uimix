import { computed, makeObservable, observable } from "mobx";
import { EdgeOffsets, Rect } from "paintvec";
import shortUUID from "short-uuid";
import type * as hast from "hast";
import { h } from "hastscript";
import { Element } from "./Element";
import { RootElement } from "./RootElement";
import { Style } from "./Style";
import { TextInstance } from "./TextInstance";
import { DefaultVariant, Variant } from "./Variant";
import { getInstance } from "./InstanceRegistry";

// Variant × Element
export class ElementInstance {
  private constructor(variant: Variant | undefined, element: Element) {
    this._variant = variant;
    this.element = element;
    makeObservable(this);
  }

  readonly key = shortUUID.generate();

  get type(): "element" {
    return "element";
  }

  readonly _variant: Variant | undefined;

  get variant(): Variant | DefaultVariant | undefined {
    if (this._variant) {
      return this._variant;
    }

    const component = this.element.component;
    if (component) {
      return component.defaultVariant;
    }
  }

  readonly element: Element;

  get node(): Element {
    return this.element;
  }

  get parent(): ElementInstance | undefined {
    return this.element.parent
      ? getInstance(this.variant, this.element.parent)
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
      getInstance(this.variant, child)
    );
  }

  @computed get allDescendants(): (ElementInstance | TextInstance)[] {
    return [this, ...this.children.flatMap((child) => child.allDescendants)];
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

  @computed get computedPaddings(): EdgeOffsets {
    return EdgeOffsets.from({
      top: Number.parseFloat(this.computedStyle.paddingTop ?? "0"),
      right: Number.parseFloat(this.computedStyle.paddingRight ?? "0"),
      bottom: Number.parseFloat(this.computedStyle.paddingBottom ?? "0"),
      left: Number.parseFloat(this.computedStyle.paddingLeft ?? "0"),
    });
  }

  @computed get computedMargins(): EdgeOffsets {
    return EdgeOffsets.from({
      top: Number.parseFloat(this.computedStyle.marginTop ?? "0"),
      right: Number.parseFloat(this.computedStyle.marginRight ?? "0"),
      bottom: Number.parseFloat(this.computedStyle.marginBottom ?? "0"),
      left: Number.parseFloat(this.computedStyle.marginLeft ?? "0"),
    });
  }

  @computed get computedBorderWidths(): EdgeOffsets {
    return EdgeOffsets.from({
      top: Number.parseFloat(this.computedStyle.borderTopWidth ?? "0"),
      right: Number.parseFloat(this.computedStyle.borderRightWidth ?? "0"),
      bottom: Number.parseFloat(this.computedStyle.borderBottomWidth ?? "0"),
      left: Number.parseFloat(this.computedStyle.borderLeftWidth ?? "0"),
    });
  }

  resizeWithBoundingBox(
    boundingBox: Rect,
    options: {
      x?: boolean;
      y?: boolean;
      width?: boolean;
      height?: boolean;
    }
  ): void {
    if (!this.parent) {
      const variant = this.variant;
      if (variant) {
        if (options.x) {
          variant.x = boundingBox.left;
        }
        if (options.y) {
          variant.y = boundingBox.top;
        }
      }
    } else if (
      this.computedStyle.position === "absolute" ||
      this.style.position === "absolute"
    ) {
      const offset = this.parent.offsetParentOfChildren.boundingBox.topLeft;
      if (options.x) {
        this.style.left = `${boundingBox.left - offset.x}px`;
      }
      if (options.y) {
        this.style.top = `${boundingBox.top - offset.y}px`;
      }
    }

    if (options.width) {
      this.style.width = `${boundingBox.width}px`;
    }
    if (options.height) {
      this.style.height = `${boundingBox.height}px`;
    }
  }

  get inFlow(): boolean {
    // TODO: handle position: fixed
    if (
      this.computedStyle.position === "absolute" ||
      this.style.position === "absolute" ||
      !this.parent
    ) {
      return false;
    }
    return true;
  }

  @computed get innerHTML(): hast.ElementContent[] {
    return this.children.map((child) => child.outerHTML);
  }

  @computed get outerHTML(): hast.Element {
    return h(
      this.element.tagName,
      {
        ...Object.fromEntries(this.element.attrs),
        id: this.element.id,
        style: this.style.toString(), // TODO: include styles of super variants
      },
      this.innerHTML
    );
  }
}
