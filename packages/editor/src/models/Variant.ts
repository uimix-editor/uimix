import { computed, makeObservable, observable } from "mobx";
import shortUUID from "short-uuid";
import { Component } from "./Component";
import { ElementInstance } from "./ElementInstance";

export interface BaseVariantJSON {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

abstract class BaseVariant {
  constructor(component: Component) {
    this.component = component;
    this.rootInstance = ElementInstance.get(
      this as BaseVariant as Variant | DefaultVariant,
      this.component.rootElement
    );
    makeObservable(this);
  }

  readonly component: Component;
  readonly rootInstance: ElementInstance;

  @observable x = 0;
  @observable y = 0;
  @observable width: number | undefined = undefined;
  @observable height: number | undefined = undefined;

  abstract get name(): string;

  toJSON(): BaseVariantJSON {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  loadJSON(json: BaseVariantJSON): void {
    this.x = json.x;
    this.y = json.y;
    this.width = json.width;
    this.height = json.height;
  }
}

export class DefaultVariant extends BaseVariant {
  get type(): "defaultVariant" {
    return "defaultVariant";
  }

  get name(): string {
    return "default";
  }
}

export class Variant extends BaseVariant {
  constructor(component: Component, key?: string) {
    super(component);
    this.key = key ?? shortUUID.generate();
    makeObservable(this);
  }

  get type(): "variant" {
    return "variant";
  }

  readonly key: string;

  @observable selector = "";
  @observable mediaQuery = "";

  @computed get name(): string {
    if (this.selector && this.mediaQuery) {
      return `${this.mediaQuery} ${this.selector}`;
    }
    if (this.selector) {
      return this.selector;
    }
    if (this.mediaQuery) {
      return this.mediaQuery;
    }
    return "";
  }

  toJSON(): VariantJSON {
    return {
      key: this.key,
      selector: this.selector || undefined,
      mediaQuery: this.mediaQuery || undefined,
      ...super.toJSON(),
    };
  }

  loadJSON(json: VariantJSON): void {
    if (json.key !== this.key) {
      throw new Error("Variant key mismatch");
    }

    this.selector = json.selector || "";
    this.mediaQuery = json.mediaQuery || "";
    super.loadJSON(json);
  }
}

export interface VariantJSON extends BaseVariantJSON {
  key: string;
  selector?: string;
  mediaQuery?: string;
}
