// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// @ts-ignore

import { contextBridge, ipcRenderer } from "electron";

interface LocalDocument {
  id: string;
  name: string;
  path: string;
  updatedAt: number;
}

interface UIMixDesktopAPI {
  desktop: true;
  wait(ms: number): Promise<void>;
  getLocalDocuments(): Promise<LocalDocument[]>;
  createLocalDocument(): Promise<LocalDocument | undefined>;
  addExistingLocalDocument(): Promise<LocalDocument | undefined>;
  deleteLocalDocument(id: string): Promise<void>;

  getLocalDocumentData(id: string): Promise<Uint8Array>;
  setLocalDocumentData(id: string, data: Uint8Array): Promise<void>;
}

const api: UIMixDesktopAPI = {
  desktop: true,
  wait: async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  },
};

contextBridge.exposeInMainWorld("myAPI", api);
