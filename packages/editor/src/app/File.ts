import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { Document, DocumentJSON } from "../models/Document";
import { parseDocument, stringifyDocument } from "../fileFormat/document";

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

  async clear(): Promise<void> {
    if (!(await this.confirmClose())) {
      return;
    }

    this.fileHandle = undefined;
    this.history = new JSONUndoHistory<DocumentJSON, Document>(new Document());
  }

  async open(): Promise<void> {
    if (!(await this.confirmClose())) {
      return;
    }

    const [fileHandle] = await showOpenFilePicker(filePickerOptions);

    try {
      const data = await (await fileHandle.getFile()).text();
      const document = new Document();
      parseDocument(document, data);
      runInAction(() => {
        this.history = new JSONUndoHistory<DocumentJSON, Document>(document);
        this.fileHandle = fileHandle;
      });
    } catch (e) {
      window.alert(`Error parsing ${fileHandle.name}: ${String(e)}`);
    }
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

    const contents = stringifyDocument(this.history.target);

    const writable = await this.fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();

    runInAction(() => {
      this.history.updateSavePoint();
    });
  }

  async confirmClose(): Promise<boolean> {
    if (!this.history.isModified) {
      return true;
    }

    if (
      window.confirm(
        `"${this.fileName}" is modified. Do you want to discard your changes?`
      )
    ) {
      return true;
    }

    return false;
  }
}
