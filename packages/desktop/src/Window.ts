import { BrowserWindow, shell, WebContents } from "electron";
import path from "path";
import { File } from "./File";

export class Window {
  constructor(file: File) {
    this.file = file;
    this.window = new BrowserWindow({
      width: 1280,
      height: 720,
      titleBarStyle: "hiddenInset",
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    windows.set(this.window.webContents, this);

    this.window.webContents.setWindowOpenHandler((details) => {
      void shell.openExternal(details.url);
      return { action: "deny" };
    });

    // and load the index.html of the app.
    // this.window.loadFile(path.join(__dirname, "index.html"));
    if (process.env.NODE_ENV === "development") {
      void this.window.loadURL("http://localhost:3000/local-editor");
      this.window.webContents.openDevTools();
    } else {
      void this.window.loadURL("https://www.uimix.app/local-editor");
    }
  }

  readonly file: File;
  readonly window: BrowserWindow;
}

export const windows = new WeakMap<WebContents, Window>();
