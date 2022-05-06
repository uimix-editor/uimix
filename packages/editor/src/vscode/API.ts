import type { APIInterface } from "../../../vscode/src/APIInterface";
import { VSCodeFile } from "./VSCodeFile";

export class API implements APIInterface {
  constructor(file: VSCodeFile) {
    this.file = file;
  }

  setContent(content: string): void {
    this.file.setContent(content);
  }
  getContent(): string {
    return this.file.getContent();
  }
  updateSavePoint(): void {
    this.file.updateSavePoint();
  }
  onDirtyChange(callback: (isDirty: boolean) => void): void {
    this.file.onDirtyChange(callback);
  }

  readonly file: VSCodeFile;
}
