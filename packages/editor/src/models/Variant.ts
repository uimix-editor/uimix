import { makeObservable, observable } from "mobx";
import { Component } from "./Component";

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
}
