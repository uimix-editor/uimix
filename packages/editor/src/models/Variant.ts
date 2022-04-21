import { makeObservable, observable } from "mobx";
import shortUUID from "short-uuid";
import { Component } from "./Component";

export class Variant {
  constructor(component: Component, key?: string) {
    this.component = component;
    this.key = key ?? shortUUID.generate();
    makeObservable(this);
  }

  readonly component: Component;
  readonly key: string;

  @observable selector = "";
  @observable mediaQuery = "";
  @observable x = 0;
  @observable y = 0;
  @observable width: number | undefined = undefined;
  @observable height: number | undefined = undefined;

  toJSON(): VariantJSON {
    return {
      key: this.key,
      selector: this.selector || undefined,
      mediaQuery: this.mediaQuery || undefined,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  loadJSON(json: VariantJSON): void {
    if (json.key !== this.key) {
      throw new Error("Variant key mismatch");
    }

    this.selector = json.selector || "";
    this.mediaQuery = json.mediaQuery || "";
    this.x = json.x;
    this.y = json.y;
    this.width = json.width;
    this.height = json.height;
  }
}

export interface VariantJSON {
  key: string;
  selector?: string;
  mediaQuery?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}
