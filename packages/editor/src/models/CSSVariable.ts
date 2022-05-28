import { makeObservable, observable } from "mobx";
import { Color } from "@seanchas116/paintkit/src/util/Color";
import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import {
  generateUID,
  isValidCSSIdentifier,
} from "@seanchas116/paintkit/src/util/Name";
import { kebabCase } from "lodash-es";
import { CSSVariableList } from "./CSSVariableList";
import { Document } from "./Document";

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
    this.rename(options.name ?? "--" + kebabCase(this.color.getName()));
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

    const oldName = this.name;
    super.rename(name);
    const newName = this.name;
    this.document?.renameCSSVariableUsages(oldName, newName);
  }

  get document(): Document | undefined {
    return this.parent?.document;
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
