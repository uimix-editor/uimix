import {
  TreeNode,
  TreeNodeOptions,
} from "@seanchas116/paintkit/src/util/TreeNode";
import { makeObservable, observable } from "mobx";
import type * as hast from "hast";
import { Element } from "./Element";

export interface TextJSON {
  type: "text";
  key: string;
  content: string;
}

export interface TextOptions extends TreeNodeOptions {
  content: string;
}

export class Text extends TreeNode<Element, Text, never> {
  constructor(options: TextOptions) {
    super(options);
    this.content = options.content;
    makeObservable(this);
  }

  get type(): "text" {
    return "text";
  }

  @observable content: string;

  get outerHTML(): hast.Text {
    return {
      type: "text",
      value: this.content,
    };
  }

  toJSON(): TextJSON {
    return {
      type: "text",
      content: this.content,
      key: this.key,
    };
  }

  loadJSON(json: TextJSON): void {
    if (this.key !== json.key) {
      throw new Error("Text key must match");
    }
    this.content = json.content;
  }
}
