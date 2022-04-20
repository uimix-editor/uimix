import { makeObservable, observable } from "mobx";
import { RootElement } from "./RootElement";
import { Variant } from "./Variant";

export class Component {
  constructor() {
    makeObservable(this);
  }

  @observable name = "my-component";

  readonly defaultVariant = new Variant(this);
  readonly variants = observable<Variant>([]);

  readonly rootElement = new RootElement(this);
}
