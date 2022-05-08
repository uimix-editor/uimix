import { makeObservable, observable } from "mobx";

export class IconBrowserState {
  constructor() {
    makeObservable(this);
  }

  @observable size = 24;
  @observable rotationCount = 0;
  @observable hFlip = false;
}
