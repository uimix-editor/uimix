import { Component } from "./Component";
import { Element } from "./Element";

export class RootElement extends Element {
  constructor(component: Component) {
    super({
      tagName: "div",
    });
    this._component = component;
  }

  get isUniqueNameRoot(): boolean {
    return true;
  }

  private readonly _component: Component;

  get component(): Component {
    return this._component;
  }
}
