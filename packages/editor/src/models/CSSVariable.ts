import { makeObservable, observable } from "mobx";
import { Color } from "@seanchas116/paintkit/src/util/Color";
import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import {
  generateUID,
  isValidCSSIdentifier,
} from "@seanchas116/paintkit/src/util/Name";
import { CSSVariableList } from "./CSSVariableList";

export interface CSSVariableJSON {
  uid: string;
  name: string;
  color: string;
}

interface CSSVariableOptions {
  uid?: string;
  name?: string;
  color?: Color;
}

// TODO: support non-color css variables
export class CSSVariable extends TreeNode<CSSVariableList, CSSVariable, never> {
  constructor(options: CSSVariableOptions = {}) {
    super();
    this.uid = options.uid ?? generateUID();
    this.color = options.color ?? Color.fromName("white");
    this.rename(options.name ?? this.color.getName());
    makeObservable(this);
  }

  readonly uid: string;

  get hasUniqueName(): boolean {
    return true;
  }

  rename(name: string): void {
    if (!isValidCSSIdentifier(name) || !name.startsWith("--")) {
      throw new Error("Invalid CSS Variable Name");
    }

    super.rename(name);
  }

  @observable color: Color;

  @observable selected = false;

  toJSON(): CSSVariableJSON {
    return {
      uid: this.uid,
      name: this.name,
      color: this.color.toHex(),
    };
  }

  static fromJSON(json: CSSVariableJSON): CSSVariable {
    return new CSSVariable({
      uid: json.uid,
      name: json.name,
      color: Color.from(json.color),
    });
  }
}
