export interface IWebviewAPI {
  setContent(content: string, url: string | undefined): Promise<void>;
  getContent(): Promise<string>;
  updateSavePoint(): Promise<void>;
  setImageAssets(assets: string[]): Promise<void>;
}

export interface IExtensionAPI {
  onDirtyChange(isDirty: boolean): Promise<void>;
}
