export interface IVSCodeToEditorRPCHandler {
  init(data: Uint8Array): Promise<void>;
  update(data: Uint8Array): Promise<void>;
}

export interface IEditorToVSCodeRPCHandler {
  ready(data: Uint8Array): Promise<void>;
  update(data: Uint8Array): Promise<void>;
}
