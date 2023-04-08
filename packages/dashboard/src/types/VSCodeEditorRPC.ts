export interface IVSCodeToEditorRPCHandler {
  sync(data: Uint8Array): Promise<void>;
}

export interface IEditorToVSCodeRPCHandler {
  ready(data: Uint8Array): Promise<void>;
  update(data: Uint8Array): Promise<void>;
}
