import { LocalDocument, ProjectJSON } from "./LocalDocument";

export interface UIMixDesktopAPI {
  desktop: true;
  wait(ms: number): Promise<void>;
  getLocalDocuments(): Promise<LocalDocument[]>;
  createLocalDocument(): Promise<LocalDocument | undefined>;
  addExistingLocalDocument(): Promise<LocalDocument | undefined>;
  deleteLocalDocument(id: string): Promise<void>;

  getLocalDocumentData(id: string): Promise<ProjectJSON>;
  setLocalDocumentData(id: string, data: ProjectJSON): Promise<void>;

  saveImage(data: Uint8Array): Promise<string>;
}
