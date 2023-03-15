// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// @ts-ignore

import { contextBridge, ipcRenderer } from "electron";
import { IPCMainAPI } from "./types/IPCMainAPI";
import { ProjectJSON } from "./types/LocalDocument";
import { UIMixDesktopAPI } from "./types/UIMixDesktopAPI";

const api: UIMixDesktopAPI = {
  desktop: true,
  wait: async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  },
  getLocalDocuments: () => {
    return invoke("getLocalDocuments");
  },
  createLocalDocument: () => {
    return invoke("createLocalDocument");
  },
  addExistingLocalDocument: () => {
    return invoke("addExistingLocalDocument");
  },
  deleteLocalDocument: (id: string) => {
    return invoke("deleteLocalDocument", id);
  },
  getLocalDocumentData: (id: string) => {
    return invoke("getLocalDocumentData", id);
  },
  setLocalDocumentData: (id: string, data: ProjectJSON) => {
    return invoke("setLocalDocumentData", id, data);
  },
  saveImage: (data: Uint8Array) => {
    return invoke("saveImage", data);
  },
};

contextBridge.exposeInMainWorld("uimixDesktopAPI", api);

function invoke<T extends keyof IPCMainAPI>(
  name: T,
  ...args: Parameters<IPCMainAPI[T]>
): Promise<ReturnType<IPCMainAPI[T]>> {
  return ipcRenderer.invoke(name, ...args);
}
