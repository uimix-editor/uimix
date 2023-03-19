// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// @ts-ignore

import { contextBridge, ipcRenderer } from "electron";
import { IPCMainAPI } from "./types/IPCMainAPI";
import { ProjectJSON, DesktopAPI } from "../../dashboard/src/types/DesktopAPI";

const api: DesktopAPI = {
  desktop: true,
  wait: async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  },
  getLocalDocuments: () => {
    return invoke("getLocalDocuments");
  },
  getLocalDocument: (id) => {
    return invoke("getLocalDocument", id);
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
};

contextBridge.exposeInMainWorld("uimixDesktopAPI", api);

function invoke<T extends keyof IPCMainAPI>(
  name: T,
  ...args: Parameters<IPCMainAPI[T]>
): Promise<ReturnType<IPCMainAPI[T]>> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return ipcRenderer.invoke(name, ...args);
}
