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
}
