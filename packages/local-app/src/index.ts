import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import { localDocumentRepository } from "./LocalDocumentRepository";
import { IPCMainAPI } from "./types/IPCMainAPI";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, "index.html"));
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL("https://www.uimix.app");
  }
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
    ...args: Parameters<IPCMainAPI[K]>
  ) => Promise<ReturnType<IPCMainAPI[K]>>;
}) {
  for (const key of Object.keys(handler)) {
    ipcMain.handle(key, (e, ...args) => {
      // @ts-ignore
      return handler[key](...args);
    });
  }
}

handleIPC({
  getLocalDocuments: async () => {
    return localDocumentRepository.getLocalDocuments();
  },
  getLocalDocument: async (id) => {
    return localDocumentRepository.getLocalDocument(id);
  },
  createLocalDocument: async () => {
    return localDocumentRepository.createLocalDocument();
  },
  addExistingLocalDocument: async () => {
    return localDocumentRepository.addExistingLocalDocument();
  },
  deleteLocalDocument: async (id) => {
    return localDocumentRepository.deleteLocalDocument(id);
  },
  getLocalDocumentData: async (id) => {
    return localDocumentRepository.getLocalDocumentData(id);
  },
  setLocalDocumentData: async (id, data) => {
    return localDocumentRepository.setLocalDocumentData(id, data);
  },
});
