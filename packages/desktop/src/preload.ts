// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// @ts-ignore

import { contextBridge, ipcRenderer } from "electron";
import { IPCMainAPI } from "./types/IPCMainAPI";
import { ProjectJSON, DesktopAPI } from "../../dashboard/src/types/DesktopAPI";

const api: DesktopAPI = {
  getDocumentMetadata: async () => {
    return await invoke("getDocumentMetadata");
  },
  getDocumentData: async () => {
    return await invoke("getDocumentData");
  },
  setDocumentData: async (data: ProjectJSON) => {
    await invoke("setDocumentData", data);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDocumentDataChange: (callback: (data: ProjectJSON) => void) => {
    // TODO: implement
    return () => {};
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
