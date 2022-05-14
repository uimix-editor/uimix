export interface ImageAsset {
  relativePath: string;
  url: string;
}

export interface IWebviewAPI {
  setContent(content: string, url: string | undefined): void;
  getContent(): string;
  updateSavePoint(): void;
  setImageAssets(assets: readonly ImageAsset[]): void;
}

export interface IExtensionAPI {
  onDirtyChange(isDirty: boolean): void;
}
