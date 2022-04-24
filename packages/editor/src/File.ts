import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { computed, makeObservable, observable, runInAction } from "mobx";
import { Document, DocumentJSON } from "./models/Document";
import { parseDocument, stringifyDocument } from "./models/FileFormat";

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
    // TODO: warn if modified
    this.fileHandle = undefined;
    this.history = new JSONUndoHistory<DocumentJSON, Document>(new Document());
  }

  async open(): Promise<void> {
    // TODO: warn if modified
    const [fileHandle] = await showOpenFilePicker(filePickerOptions);
    const data = await (await fileHandle.getFile()).text();

    runInAction(() => {
      try {
        const document = parseDocument(data);
        this.history = new JSONUndoHistory<DocumentJSON, Document>(document);
        this.fileHandle = fileHandle;
      } catch (e) {
        window.alert(`Error parsing ${fileHandle.name}: ${String(e)}`);
      }
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

    const contents = stringifyDocument(this.history.target);

    const writable = await this.fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();

    runInAction(() => {
      this.history.updateSavePoint();
    });
  }
}
