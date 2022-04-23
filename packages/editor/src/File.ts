import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { Document, DocumentJSON } from "./models/Document";

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

  readonly document = new Document();
  readonly history = new JSONUndoHistory<DocumentJSON, Document>(this.document);

  @observable.ref private fileHandle: FileSystemFileHandle | undefined =
    undefined;

  @computed get fileName(): string {
    return this.fileHandle?.name ?? "Untitled";
  }

  clear(): void {
    this.fileHandle = undefined;
    this.history.revert({
      components: [],
    });
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

    const contents = ""; // TODO
    await writable.write(contents);

    await writable.close();

    runInAction(() => {
      this.history.updateSavePoint();
    });
  }
}
