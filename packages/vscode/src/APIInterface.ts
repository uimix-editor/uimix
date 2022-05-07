export interface IWebviewAPI {
  setContent(content: string): void;
  getContent(): string;
  updateSavePoint(): void;
}

export interface IExtensionAPI {
  onDirtyChange(isDirty: boolean): void;
}
