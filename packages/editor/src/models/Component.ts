import { makeObservable, observable } from "mobx";
import { Variant } from "./Variant";

export class Component {
  constructor() {
    makeObservable(this);
  }

  readonly defaultVariant = new Variant();
  readonly variants = observable<Variant>([]);

  @observable name = "my-component";
}
