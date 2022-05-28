import { Color } from "@seanchas116/paintkit/src/util/Color";
import { TreeNode } from "@seanchas116/paintkit/src/util/TreeNode";
import * as postcss from "postcss";
import { CSSVariable, CSSVariableJSON } from "./CSSVariable";
import { Document } from "./Document";

export class CSSVariableList extends TreeNode<
  never,
  CSSVariableList,
  CSSVariable
> {
  constructor(document: Document) {
    super();
    this.document = document;
  }

  readonly document: Document;

  get isUniqueNameRoot(): boolean {
    return true;
  }

  forName(name: string): CSSVariable | undefined {
    return this.getDescendantByName(name) as CSSVariable | undefined;
  }

  selectAll(): void {
    for (const token of this.children) {
      token.selected = true;
    }
  }

  deselectAll(): void {
    for (const token of this.children) {
      token.selected = false;
    }
  }

  deleteSelected(): void {
    for (const token of this.children) {
      if (token.selected) {
        token.remove();
      }
    }
  }

  get selectedVariables(): CSSVariable[] {
    return this.children.filter((token) => token.selected);
  }

  add(color: Color): CSSVariable {
    const variable = new CSSVariable();
    variable.color = color;
    this.append(variable);
    return variable;
  }

  toCSSRule(): postcss.Rule {
    const root = new postcss.Rule({
      selector: ":root",
    });

    for (const variable of this.children) {
      root.append(
        new postcss.Declaration({
          prop: variable.name,
          value: variable.color.toString(),
        })
      );
    }

    return root;
  }

  toJSON(): CSSVariableJSON[] {
    return this.children.map((token) => token.toJSON());
  }

  loadJSON(json: CSSVariableJSON[]): void {
    const vars = json.map((json) => CSSVariable.fromJSON(json));
    this.replaceChildren(vars);
  }
}
