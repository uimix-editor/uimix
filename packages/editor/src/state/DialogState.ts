import { makeObservable, observable } from "mobx";

class DialogState {
  constructor() {
    makeObservable(this);
  }

  @observable foreignComponentListDialogOpen = false;
}

export const dialogState = new DialogState();
