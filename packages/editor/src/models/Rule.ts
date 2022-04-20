import { makeObservable, observable } from "mobx";
import * as CSSwhat from "css-what";
import { Style } from "./Style";

export class Rule {
  constructor() {
    makeObservable(this);
  }

  readonly style = new Style();

  @observable mediaQuery = "";
  @observable selector: CSSwhat.Selector[][] = [];
}
