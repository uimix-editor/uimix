import { LocalDocument } from "./LocalDocument";

export interface IPCMainAPI {
  getLocalDocuments(): LocalDocument[];
  createLocalDocument(): LocalDocument | undefined;
  addExistingLocalDocument(): LocalDocument | undefined;
  deleteLocalDocument(id: string): void;

  getLocalDocumentData(id: string): Uint8Array;
  setLocalDocumentData(id: string, data: Uint8Array): void;

  saveImage(data: Uint8Array): string;
}
