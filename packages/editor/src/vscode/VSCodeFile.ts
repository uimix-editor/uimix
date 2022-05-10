import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { makeObservable, observable, reaction, runInAction } from "mobx";
import { Document, DocumentJSON } from "../models/Document";
import { parseDocument, stringifyDocument } from "../models/FileFormat";

export class VSCodeFile {
  constructor() {
    makeObservable(this);
  }

  @observable.ref history = new JSONUndoHistory<DocumentJSON, Document>(
    new Document()
  );

  setContent(content: string): void {
    try {
      const currentContent = stringifyDocument(this.history.target);
      if (currentContent === content) {
        return;
      }
      const document = parseDocument(content);
      runInAction(() => {
        this.history = new JSONUndoHistory<DocumentJSON, Document>(document);
      });
    } catch (e) {
      console.error(e);
    }
  }

  getContent(): string {
    return stringifyDocument(this.history.target);
  }

  updateSavePoint(): void {
    this.history.updateSavePoint();
  }

  onDirtyChange(callback: (isDirty: boolean) => void): void {
    // TODO: dispose
    reaction(
      () => this.history.isModified,
      (isDirty) => {
        callback(isDirty);
      }
    );
  }
}
