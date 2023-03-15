import type { ProjectJSON } from "@uimix/node-data/src/project";

export { ProjectJSON };

export interface LocalDocument {
  id: string;
  name: string;
  path: string;
  updatedAt: number;
}

export interface DesktopAPI {
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

export function getDesktopAPI(): DesktopAPI | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  // @ts-ignore
  return window.uimixDesktopAPI;
}
