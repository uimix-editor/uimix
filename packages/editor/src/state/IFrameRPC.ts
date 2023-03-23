export interface IRootToEditorRPCHandler {
  sync(data: Uint8Array): Promise<void>;
  init(data: Uint8Array): Promise<void>;
}

export interface IEditorToRootRPCHandler {
  ready(): Promise<void>;
  update(data: Uint8Array): Promise<void>;
  uploadImage(
    hash: string,
    contentType: string,
    data: Uint8Array
  ): Promise<string>;
  updateThumbnail(pngData: Uint8Array): Promise<void>;
}
