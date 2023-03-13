import { computed, makeObservable, observable } from "mobx";

class DialogState {
  constructor() {
    makeObservable(this);
  }

  @observable foreignComponentListDialogOpen = false;

  @computed get isAnyOpen() {
    return this.foreignComponentListDialogOpen;
  }
}

export const dialogState = new DialogState();
