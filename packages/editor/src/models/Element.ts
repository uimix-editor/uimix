import { TreeNode } from "@seanchas116/paintkit/dist/util/TreeNode";
import { makeObservable, observable } from "mobx";
import { Text } from "./Text";

interface ElementOptions {
  tagName: string;
}

export class Element extends TreeNode<Element, Element, Element | Text> {
  constructor(options: ElementOptions) {
    super();
    this.tagName = options.tagName;
    makeObservable(this);
  }

  readonly tagName: string;

  // TODO: avoid id name confilict
  @observable id = "";

  readonly attrs = observable.map<string, string>();
}
