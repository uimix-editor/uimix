import { makeObservable, observable } from "mobx";
import { Color } from "@seanchas116/paintkit/src/util/Color";
import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { generateUID } from "@seanchas116/paintkit/src/util/Name";
import { CSSVariableList } from "./CSSVariableList";

interface ColorTokenJSON {
  uid: string;
  name: string;
  color: string;
}

// TODO: support non-color css variables
export class CSSVariable extends TreeNode<CSSVariableList, CSSVariable, never> {
  constructor(uid?: string) {
    super();
    this.uid = uid ?? generateUID();
    makeObservable(this);
  }

  readonly uid: string;

  @observable color = Color.fromName("white");

  @observable selected = false;

  toJSON(): ColorTokenJSON {
    return {
      uid: this.uid,
      name: this.name,
      color: this.color.toHex(),
    };
  }

  static fromJSON(json: ColorTokenJSON): CSSVariable {
    const token = new CSSVariable(json.uid);
    token.rename(json.name);
    token.color = Color.from(json.color) ?? Color.fromName("white");
    return token;
  }
}
