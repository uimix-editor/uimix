import {
  LocalDocument,
  ProjectJSON,
} from "../../../dashboard/src/types/DesktopAPI";

export interface IPCMainAPI {
  getLocalDocuments(): readonly LocalDocument[];
  getLocalDocument(id: string): LocalDocument | undefined;
  createLocalDocument(): LocalDocument | undefined;
  addExistingLocalDocument(): LocalDocument | undefined;
  deleteLocalDocument(id: string): void;
  updateLocalDocumentThumbnail(id: string, pngData: Uint8Array): void;

  getLocalDocumentData(id: string): ProjectJSON;
  setLocalDocumentData(id: string, data: ProjectJSON): void;
}
