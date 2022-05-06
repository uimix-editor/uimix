export interface APIInterface {
  setContent(content: string): void;
  getContent(): string;
  updateSavePoint(): void;
  onDirtyChange(callback: (isDirty: boolean) => void): void;
}
