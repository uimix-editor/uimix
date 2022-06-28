import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { makeObservable, observable, reaction, runInAction } from "mobx";
import { Document, DocumentJSON } from "../models/Document";
import { parseDocument, stringifyDocument } from "../fileFormat/document";

class History extends JSONUndoHistory<DocumentJSON, Document> {
  commit(title: string, mergeInterval?: number): boolean {
    const ret = super.commit(title, mergeInterval);

    plausible("commit", {
      props: {
        title,
      },
    });

    return ret;
  }
}

export class VSCodeFile {
  constructor() {
    makeObservable(this);
  }

  @observable.ref history = new History(new Document());
  @observable url?: string = undefined;

  setContent(content: string, url: string | undefined): void {
    try {
      const currentContent = stringifyDocument(this.history.target);
      if (currentContent === content) {
        return;
      }
      const document = new Document();
      parseDocument(document, content);
      runInAction(() => {
        this.history = new History(document);
        this.url = url;
        console.log(url);
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
