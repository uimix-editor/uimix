export interface IVSCodeToEditorRPCHandler {
  init(data: Uint8Array, pageID: string): Promise<void>;
  update(data: Uint8Array): Promise<void>;
}

export interface IEditorToVSCodeRPCHandler {
  ready(): Promise<void>;
  update(data: Uint8Array): Promise<void>;
  getClipboard(type: "text" | "image"): Promise<string>;
  setClipboard(type: "text" | "image", content: string): Promise<void>;
}
