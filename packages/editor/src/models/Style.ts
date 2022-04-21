import { makeObservable, observable } from "mobx";

export interface StyleJSON {
  color?: string;
}

export class Style {
  constructor() {
    makeObservable(this);
  }

  @observable color: string | undefined = undefined;

  toJSON(): StyleJSON {
    return {
      color: this.color,
    };
  }

  loadJSON(json: StyleJSON): void {
    this.color = json.color;
  }
}
