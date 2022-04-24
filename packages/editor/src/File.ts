import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { Document, DocumentJSON } from "./models/Document";
import { stringifyDocument } from "./models/FileFormat";

const filePickerOptions = {
  types: [
    {
      description: "Macaron File",
      accept: {
        "text/plain": [".macaron"],
      },
    },
  ],
};

export class File {
  constructor() {
    makeObservable(this);
  }

  @observable.ref history = new JSONUndoHistory<DocumentJSON, Document>(
    new Document()
  );
  @observable.ref private fileHandle: FileSystemFileHandle | undefined =
    undefined;

  @computed get fileName(): string {
    return this.fileHandle?.name ?? "Untitled";
  }

  clear(): void {
    this.fileHandle = undefined;
    this.history = new JSONUndoHistory<DocumentJSON, Document>(new Document());
  }

  async saveAs(): Promise<void> {
    this.fileHandle = await showSaveFilePicker(filePickerOptions);
    await this.save();
  }

  async save(): Promise<void> {
    if (!this.fileHandle) {
      await this.saveAs();
      return;
    }

    const writable = await this.fileHandle.createWritable();

    const contents = stringifyDocument(this.history.target);

    await writable.write(contents);

    await writable.close();

    runInAction(() => {
      this.history.updateSavePoint();
    });
  }
}
