import { makeObservable, observable } from "mobx";

export class IconBrowserState {
  constructor() {
    makeObservable(this);
  }

  @observable size = 24;
  @observable rotation = 0;
  @observable flipX = false;
}
