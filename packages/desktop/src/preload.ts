// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// @ts-ignore

import { contextBridge, ipcRenderer, ipcRenderer } from "electron";
import { IPCMainAPI } from "./types/IPCMainAPI";
import {
  ProjectJSON,
  DesktopAPI,
  DocumentMetadata,
} from "../../dashboard/src/types/DesktopAPI";
import { TypedEmitter } from "tiny-typed-emitter";

const emitter = new TypedEmitter<{
  documentMetadataChange: (metadata: DocumentMetadata) => void;
  dataChange: (data: ProjectJSON) => void;
}>();

ipcRenderer.on(
  "documentMetadataChange",
  (event, metadata: DocumentMetadata) => {
    console.log("preload documentMetadataChange", metadata);
    emitter.emit("documentMetadataChange", metadata);
  }
);
ipcRenderer.on("dataChange", (event, data: ProjectJSON) => {
  emitter.emit("dataChange", data);
});

console.log("preload init", ipcRenderer);

const api: DesktopAPI = {
  getDocumentMetadata: async () => {
    return await invoke("getDocumentMetadata");
  },
  onDocumentMetadataChange: (
    callback: (metadata: DocumentMetadata) => void
  ) => {
    emitter.on("documentMetadataChange", callback);
    return () => {
      emitter.off("documentMetadataChange", callback);
    };
  },

  getDocumentData: async () => {
    return await invoke("getDocumentData");
  },
  setDocumentData: async (data: ProjectJSON) => {
    await invoke("setDocumentData", data);
  },
  onDocumentDataChange: (callback: (data: ProjectJSON) => void) => {
    emitter.on("dataChange", callback);
    return () => {
      emitter.off("dataChange", callback);
    };
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
