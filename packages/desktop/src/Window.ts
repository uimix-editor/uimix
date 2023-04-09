import { BrowserWindow, dialog, shell, WebContents } from "electron";
import path from "path";
import { File } from "./File";

export class Window {
  private constructor(file: File) {
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

    file.on("metadataChange", () => {
      this.window.webContents.send("documentMetadataChange", file.metadata);
    });
    file.on("dataChange", (data) => {
      this.window.webContents.send("documentDataChange", data);
    });
    file.on("editedChange", (edited) => {
      this.window.setDocumentEdited(edited);
    });

    this.window.on("close", async (event) => {
      if (this.file.edited && !this.closeConfirmed) {
        const choice = dialog.showMessageBoxSync(this.window, {
          type: "question",
          buttons: ["Save", "Discard", "Cancel"],
          defaultId: 0,
          cancelId: 2,
          title: "Unsaved Changes",
          message: "Do you want to save the changes you made?",
          detail: "Your changes will be lost if you don't save them.",
        });
        if (choice === 0) {
          await this.file.save();
          this.closeConfirmed = true;
          this.window.close();
        }
        if (choice === 2) {
          event.preventDefault();
        }
      }
    });
  }

  readonly file: File;
  readonly window: BrowserWindow;
  private closeConfirmed = false;

  static new() {
    new Window(new File());
  }

  static async open(filePath: string) {
    for (const browserWindow of BrowserWindow.getAllWindows()) {
      const window = windows.get(browserWindow.webContents);
      if (window && window.file.filePath === filePath) {
        browserWindow.focus();
        return;
      }
    }
    const file = await File.openFilePath(filePath);
    return new Window(file);
  }

  static async openFromDialog() {
    const file = await File.open();
    if (!file) {
      return;
    }
    return new Window(file);
  }
}

export const windows = new WeakMap<WebContents, Window>();
