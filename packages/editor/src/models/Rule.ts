import { makeObservable, observable } from "mobx";
import { Style } from "./Style";

export class Rule {
  constructor() {
    makeObservable(this);
  }

  readonly style = new Style();

  @observable mediaQuery = "";
  // TODO: parse selector (use https://github.com/fb55/css-what ?)
  @observable selector = "";
}
