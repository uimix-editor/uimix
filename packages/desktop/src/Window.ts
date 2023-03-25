import { BrowserWindow, dialog, shell, WebContents } from "electron";
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

    file.on("metadataChange", () => {
      this.window.webContents.send("documentMetadataChange", file.metadata);
      this.window.setDocumentEdited(file.edited);
    });
    file.on("editedChange", (edited) => {
      this.window.setDocumentEdited(edited);
    });

    this.window.on("close", (event) => {
      if (this.file.edited) {
        event.preventDefault();

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
          this.file.save();
          this.window.close();
        }
        if (choice === 1) {
          this.file.revert();
          this.window.close();
        }
      }
    });
  }

  readonly file: File;
  readonly window: BrowserWindow;
}

export const windows = new WeakMap<WebContents, Window>();
