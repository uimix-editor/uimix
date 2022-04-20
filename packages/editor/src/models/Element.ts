import { TreeNode } from "@seanchas116/paintkit/dist/util/TreeNode";
import { makeObservable, observable } from "mobx";
import { Text } from "./Text";

export class Element extends TreeNode<Element, Element, Element | Text> {
  constructor() {
    super();
    makeObservable(this);
  }

  // TODO: avoid id name confilict
  @observable id = "";
}
