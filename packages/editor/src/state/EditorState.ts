import { JSONUndoHistory } from "@seanchas116/paintkit/dist/util/JSONUndoHistory";
import { Document, DocumentJSON } from "../models/Document";

export class EditorState {
  constructor(history: JSONUndoHistory<DocumentJSON, Document>) {
    this.history = history;
  }

  readonly history: JSONUndoHistory<DocumentJSON, Document>;

  get document(): Document {
    return this.history.target;
  }
}
