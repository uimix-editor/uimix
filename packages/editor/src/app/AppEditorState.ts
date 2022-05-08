import { MenuItem } from "@seanchas116/paintkit/src/components/menu/Menu";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { KeyGesture } from "@seanchas116/paintkit/src/util/KeyGesture";
import { action, computed } from "mobx";
import { DocumentJSON, Document } from "../models/Document";
import { EditorState } from "../state/EditorState";
import { File } from "./File";

export class AppEditorState extends EditorState {
  constructor(file: File) {
    super();
    this.file = file;
  }

  readonly file: File;

  get history(): JSONUndoHistory<DocumentJSON, Document> {
    return this.file.history;
  }

  @computed get windowTitle(): string {
    return `${this.file.history.isModified ? "*" : ""}${
      this.file.fileName
    } - Macaron`;
  }

  getFileMenu(): MenuItem[] {
    return [
      {
        text: "New",
        shortcut: [new KeyGesture(["Command"], "KeyN")],
        onClick: action(() => {
          void this.file.clear();
          return true;
        }),
      },
      {
        type: "separator",
      },
      {
        text: "Open...",
        shortcut: [new KeyGesture(["Command"], "KeyO")],
        onClick: action(() => {
          void this.file.open();
          return true;
        }),
      },
      {
        type: "separator",
      },
      {
        text: "Save",
        shortcut: [new KeyGesture(["Command"], "KeyS")],
        onClick: action(() => {
          void this.file.save();
          return true;
        }),
      },
      {
        text: "Save As...",
        shortcut: [new KeyGesture(["Shift", "Command"], "KeyS")],
        onClick: action(() => {
          void this.file.saveAs();
          return true;
        }),
      },
    ];
  }

  getMainMenu(): MenuItem[] {
    return [
      {
        text: "File",
        children: this.getFileMenu(),
      },
      ...super.getMainMenu(),
    ];
  }
}
