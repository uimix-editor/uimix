import { makeObservable, observable } from "mobx";

export class Variant {
  constructor() {
    makeObservable(this);
  }

  @observable selector = "";
  @observable mediaQuery = "";
}
