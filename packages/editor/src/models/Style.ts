import { makeObservable, observable } from "mobx";

export class Style {
  constructor() {
    makeObservable(this);
  }

  @observable color: string | undefined = undefined;
}
