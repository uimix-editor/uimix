import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { IPCMainAPI } from "./types/IPCMainAPI";
import { Window, windows } from "./Window";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const filePath = dialog.showOpenDialogSync({
    properties: ["openFile"],
    filters: [{ name: "UI Mix", extensions: ["uimix"] }],
  })?.[0];
  if (!filePath) {
    return;
  }

  new Window(filePath);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("open-file", (event, filePath) => {
  event.preventDefault();
  new Window(filePath);
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
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
    window.file.save(data);
    return;
  },
});
