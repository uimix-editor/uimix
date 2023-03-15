import { LocalDocument } from "./LocalDocument";

export interface IPCMainAPI {
  getLocalDocuments(): Promise<LocalDocument[]>;
  createLocalDocument(): Promise<LocalDocument | undefined>;
  addExistingLocalDocument(): Promise<LocalDocument | undefined>;
  deleteLocalDocument(id: string): Promise<void>;

  getLocalDocumentData(id: string): Promise<Uint8Array>;
  setLocalDocumentData(id: string, data: Uint8Array): Promise<void>;

  saveImage(data: Uint8Array): Promise<string>;
}
