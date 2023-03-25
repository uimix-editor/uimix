import { BrowserWindow, shell } from "electron";
import path from "path";

export class Window {
  constructor() {
    this.window = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
    windows.set(this.window, this);

    this.window.webContents.setWindowOpenHandler((details) => {
      void shell.openExternal(details.url);
      return { action: "deny" };
    });

    // and load the index.html of the app.
    // this.window.loadFile(path.join(__dirname, "index.html"));
    if (process.env.NODE_ENV === "development") {
      void this.window.loadURL("http://localhost:3000");
      this.window.webContents.openDevTools();
    } else {
      void this.window.loadURL("https://www.uimix.app");
    }
  }

  readonly window: BrowserWindow;
}

export const windows = new WeakMap<BrowserWindow, Window>();
