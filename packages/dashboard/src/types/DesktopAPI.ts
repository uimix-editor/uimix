import type { ProjectJSON } from "@uimix/node-data/src/project";

export { ProjectJSON };

export interface LocalDocument {
  id: string;
  title: string;
  path: string;
  updatedAt: string;
}

export interface DesktopAPI {
  desktop: true;
  wait(ms: number): Promise<void>;
  getLocalDocuments(): Promise<readonly LocalDocument[]>;
  getLocalDocument(id: string): Promise<LocalDocument | undefined>;
  createLocalDocument(): Promise<LocalDocument | undefined>;
  addExistingLocalDocument(): Promise<LocalDocument | undefined>;
  deleteLocalDocument(id: string): Promise<void>;

  getLocalDocumentData(id: string): Promise<ProjectJSON>;
  setLocalDocumentData(id: string, data: ProjectJSON): Promise<void>;

  saveImage(data: Uint8Array): Promise<string>;
}

export function getDesktopAPI(): DesktopAPI | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  // @ts-ignore
  return window.uimixDesktopAPI;
}
