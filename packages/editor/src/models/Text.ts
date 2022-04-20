import { TreeNode } from "@seanchas116/paintkit/dist/util/TreeNode";
import { Element } from "./Element";
import { makeObservable, observable } from "mobx";

export class Text extends TreeNode<Element, Text, never> {
  constructor(content: string) {
    super();
    this.content = content;
    makeObservable(this);
  }

  @observable content: string;
}
