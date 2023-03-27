import { app, BrowserWindow, ipcMain } from "electron";
import { File } from "./File";
import { setApplicationMenu } from "./menu";
import { IPCMainAPI } from "./types/IPCMainAPI";
import { Window, windows } from "./Window";
import Store from "electron-store";

const store = new Store<{
  lastOpenedFiles: string[];
}>();

let isReady = false;
const filesToOpen: string[] = [];

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  isReady = true;

  const files = new Set<string>([
    ...filesToOpen,
    ...store.get("lastOpenedFiles", []),
  ]);

  if (files.size > 0) {
    for (const filePath of files) {
      Window.open(filePath);
    }
  } else {
    Window.new();
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  //if (process.platform !== "darwin") {
  app.quit();
  //}
});

app.on("open-file", (event, filePath) => {
  event.preventDefault();

  if (isReady) {
    Window.open(filePath);
  } else {
    filesToOpen.push(filePath);
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    Window.new();
  }
});

app.on("before-quit", () => {
  // save last opened files

  const browserWindows = BrowserWindow.getAllWindows();
  const lastOpenedFiles: string[] = [];
  for (const window of browserWindows) {
    const file = windows.get(window.webContents)?.file;
    if (file && file.filePath) {
      lastOpenedFiles.push(file.filePath);
    }
  }
  store.set("lastOpenedFiles", lastOpenedFiles);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function handleIPC(handler: {
  [K in keyof IPCMainAPI]: (
    e: Electron.IpcMainInvokeEvent,
    ...args: Parameters<IPCMainAPI[K]>
  ) => Promise<ReturnType<IPCMainAPI[K]>>;
}) {
  for (const key of Object.keys(handler)) {
    ipcMain.handle(key, (e, ...args) => {
      // @ts-ignore
      // eslint-disable-next-line
      return handler[key](e, ...args);
    });
  }
}

handleIPC({
  getDocumentMetadata: async (e) => {
    const window = windows.get(e.sender);
    if (!window) {
      throw new Error("Window not found");
    }
    return window.file.metadata;
  },
  getDocumentData: async (e) => {
    const window = windows.get(e.sender);
    if (!window) {
      throw new Error("Window not found");
    }
    return window.file.data;
  },
  setDocumentData: async (e, data) => {
    const window = windows.get(e.sender);
    if (!window) {
      throw new Error("Window not found");
    }
    window.file.setData(data);
    return;
  },
});

setApplicationMenu();
