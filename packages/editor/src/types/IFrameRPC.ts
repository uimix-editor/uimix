import { CodeAssets } from "@uimix/model/src/models/CodeAssets";

export interface IRootToEditorRPCHandler {
  init(data: Uint8Array, pageID?: string): Promise<void>;
  update(data: Uint8Array): Promise<void>;
  updateCodeAssets(assets: CodeAssets): Promise<void>;
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
  getCodeAssets(): Promise<CodeAssets | undefined>;

  setClipboard(type: "text" | "image", textOrDataURL: string): Promise<void>;
  getClipboard(type: "text" | "image"): Promise<string | undefined>;
}
