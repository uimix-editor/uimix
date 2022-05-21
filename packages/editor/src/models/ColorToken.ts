import { makeObservable, observable } from "mobx";
import { Color } from "@seanchas116/paintkit/src/util/Color";
import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import { generateUID } from "@seanchas116/paintkit/src/util/Name";
import { ColorTokenList } from "./ColorTokenList";

interface ColorTokenJSON {
  uid: string;
  name: string;
  color: string;
}

/**
 * A color token is a named color that can be used in the editor.
 */
export class ColorToken extends TreeNode<ColorTokenList, ColorToken, never> {
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

  static fromJSON(json: ColorTokenJSON): ColorToken {
    const token = new ColorToken(json.uid);
    token.rename(json.name);
    token.color = Color.from(json.color) ?? Color.fromName("white");
    return token;
  }
}
