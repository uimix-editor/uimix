import {
  TreeNode,
  TreeNodeOptions,
} from "@seanchas116/paintkit/src/util/TreeNode";
import { computed, makeObservable, observable } from "mobx";
import type * as hast from "hast";
import { h } from "hastscript";
import { Component } from "./Component";
import { Text, TextJSON } from "./Text";

export interface ElementJSON {
  type: "element";
  key: string;
  tagName: string;
  id: string;
  attrs: { [key: string]: string };
  children: (ElementJSON | TextJSON)[];
}

export interface ElementOptions extends TreeNodeOptions {
  tagName: string;
}

export class Element extends TreeNode<Element, Element, Element | Text> {
  constructor(options: ElementOptions) {
    super(options);
    this._tagName = options.tagName;
    makeObservable(this);
  }

  get type(): "element" {
    return "element";
  }

  get tagName(): string {
    return this._tagName;
  }

  private readonly _tagName: string;

  get id(): string {
    return this.name;
  }

  setID(id: string): void {
    this.rename(id);
  }

  get hasUniqueName(): boolean {
    return true;
  }

  readonly attrs = observable.map<string, string>();

  get allAttrs(): Record<string, string> {
    const attrs = Object.fromEntries(this.attrs);
    if (this.id) {
      attrs.id = this.id;
    }
    return attrs;
  }

  get component(): Component | undefined {
    return this.parent?.component;
  }

  @computed get innerHTML(): hast.ElementContent[] {
    return this.children.map((child) => child.outerHTML);
  }

  @computed get outerHTML(): hast.Element {
    return h(this.tagName, this.allAttrs, this.innerHTML);
  }

  toJSON(): ElementJSON {
    return {
      type: "element",
      key: this.key,
      tagName: this.tagName,
      id: this.id,
      attrs: Object.fromEntries(this.attrs),
      children: this.children.map((child) => child.toJSON()),
    };
  }

  loadJSON(json: ElementJSON): void {
    if (json.key !== this.key || json.tagName !== this.tagName) {
      throw new Error("Element key and tagName must match");
    }
    this.setID(json.id);
    this.attrs.clear();
    for (const [key, value] of Object.entries(json.attrs)) {
      this.attrs.set(key, value);
    }

    const oldElements = new Map<string, Element>();
    const oldTexts = new Map<string, Text>();
    for (const child of this.children) {
      if (child.type === "element") {
        oldElements.set(child.key, child);
      } else if (child instanceof Text) {
        oldTexts.set(child.key, child);
      }
    }

    this.replaceChildren([]);

    for (const childJSON of json.children) {
      if (childJSON.type === "element") {
        const child =
          oldElements.get(childJSON.key) ||
          new Element({
            key: childJSON.key,
            tagName: childJSON.tagName,
          });
        child.loadJSON(childJSON);
        this.append(child);
      } else if (childJSON.type === "text") {
        const child =
          oldTexts.get(childJSON.key) ||
          new Text({
            key: childJSON.key,
            content: childJSON.content,
          });
        child.loadJSON(childJSON);
        this.append(child);
      } else {
        throw new Error("Invalid child type");
      }
    }
  }
}
