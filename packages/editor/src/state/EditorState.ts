import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { makeObservable, observable } from "mobx";
import { Document, DocumentJSON } from "../models/Document";

export class EditorState {
  constructor(history: JSONUndoHistory<DocumentJSON, Document>) {
    this.history = history;
    makeObservable(this);
  }

  readonly history: JSONUndoHistory<DocumentJSON, Document>;

  get document(): Document {
    return this.history.target;
  }

  @observable currentOutlineTab: "outline" | "assets" = "outline";
  @observable currentInspectorTab: "element" | "style" = "element";
  @observable sideBarSplitRatio = 0.3;
  @observable sideBarWidth = 256;
}
