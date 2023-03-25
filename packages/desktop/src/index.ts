import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from "electron";
import { File } from "./File";
import { IPCMainAPI } from "./types/IPCMainAPI";
import { Window, windows } from "./Window";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const file = File.open() ?? new File(undefined);
  new Window(file);
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
  new Window(new File(filePath));
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
    window.file.data = data;
    return;
  },
});

const isMac = process.platform === "darwin";

const template: MenuItemConstructorOptions[] = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [
      {
        label: "New",
        accelerator: "CmdOrCtrl+N",
      },
      {
        label: "Open",
        accelerator: "CmdOrCtrl+O",
      },
      { type: "separator" },
      {
        label: "Save",
        accelerator: "CmdOrCtrl+S",
      },
      {
        label: "Save As",
        accelerator: "CmdOrCtrl+Shift+S",
      },
      { type: "separator" },
      ...[isMac ? { role: "close" } : { role: "quit" }],
    ],
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          await shell.openExternal("https://electronjs.org");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
