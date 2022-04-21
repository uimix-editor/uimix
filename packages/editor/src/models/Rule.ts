import { makeObservable, observable } from "mobx";
import * as CSSwhat from "css-what";
import { Style, StyleJSON } from "./Style";

export interface RuleJSON {
  mediaQuery: string;
  selector: string;
  style: StyleJSON;
}

export class Rule {
  constructor() {
    makeObservable(this);
  }

  @observable mediaQuery = "";
  @observable selector: CSSwhat.Selector[][] = [];
  readonly style = new Style();

  toJSON(): RuleJSON {
    return {
      mediaQuery: this.mediaQuery,
      selector: CSSwhat.stringify(this.selector),
      style: this.style.toJSON(),
    };
  }

  loadJSON(json: RuleJSON): void {
    this.mediaQuery = json.mediaQuery;
    this.selector = CSSwhat.parse(json.selector);
    this.style.loadJSON(json.style);
  }
}
