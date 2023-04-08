export interface IVSCodeToEditorRPCHandler {
  sync(data: Uint8Array): Promise<void>;
}

export interface IEditorToVSCodeRPCHandler {
  ready(): Promise<void>;
  sync(data: Uint8Array): Promise<void>;
}
