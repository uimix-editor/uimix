import * as Y from "yjs";
import { Project } from "../models/Project";

export class State {
  constructor() {}

  readonly doc: Y.Doc = new Y.Doc();
  readonly project = new Project(this.doc);
}

export const state = new State();
