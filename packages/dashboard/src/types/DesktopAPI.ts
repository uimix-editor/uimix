import type { ProjectJSON } from "@uimix/node-data/src/project";

export { ProjectJSON };

export interface LocalDocument {
  id: string;
  title: string;
  path: string;
  exists: boolean;
  updatedAt: string;
  thumbnail?: string;
}

export interface DesktopAPI {
  desktop: true;
  wait(ms: number): Promise<void>;
  getLocalDocuments(): Promise<readonly LocalDocument[]>;
  getLocalDocument(id: string): Promise<LocalDocument | undefined>;
  createLocalDocument(): Promise<LocalDocument | undefined>;
  addExistingLocalDocument(): Promise<LocalDocument | undefined>;
  deleteLocalDocument(id: string): Promise<void>;
  updateLocalDocumentThumbnail(id: string, pngData: Uint8Array): Promise<void>;

  getLocalDocumentData(id: string): Promise<ProjectJSON>;
  setLocalDocumentData(id: string, data: ProjectJSON): Promise<void>;
}

export function getDesktopAPI(): DesktopAPI | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return window.uimixDesktopAPI;
}
