import { observable } from "mobx";
import { Component } from "./Component";

export class Document {
  readonly components = observable<Component>([]);
}
