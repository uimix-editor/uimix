import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { DocumentJSON, Document } from "../models/Document";
import { EditorState } from "../state/EditorState";
import { VSCodeFile } from "./VSCodeFile";

export class VSCodeEditorState extends EditorState {
  constructor(file: VSCodeFile) {
    super();
    this.file = file;
  }

  readonly file: VSCodeFile;

  get history(): JSONUndoHistory<DocumentJSON, Document> {
    return this.file.history;
  }
}
