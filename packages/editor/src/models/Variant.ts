import { makeObservable, observable } from "mobx";
import { Component } from "./Component";

export interface VariantJSON {
  selector?: string;
  mediaQuery?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export class Variant {
  constructor(component: Component) {
    this.component = component;
    makeObservable(this);
  }

  readonly component: Component;

  @observable selector = "";
  @observable mediaQuery = "";
  @observable x = 0;
  @observable y = 0;
  @observable width: number | undefined = undefined;
  @observable height: number | undefined = undefined;

  toJSON(): VariantJSON {
    return {
      selector: this.selector || undefined,
      mediaQuery: this.mediaQuery || undefined,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  loadJSON(json: VariantJSON): void {
    this.selector = json.selector || "";
    this.mediaQuery = json.mediaQuery || "";
    this.x = json.x;
    this.y = json.y;
    this.width = json.width;
    this.height = json.height;
  }
}
