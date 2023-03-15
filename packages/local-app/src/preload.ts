// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// @ts-ignore

import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("myAPI", {
  desktop: true,
  wait: async (ms: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  },
});
