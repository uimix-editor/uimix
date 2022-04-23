import { MenuItem } from "@seanchas116/paintkit/dist/components/menu/Menu";
import { action, computed } from "mobx";
import { File } from "./File";
import { EditorState } from "./state/EditorState";

export class AppEditorState extends EditorState {
  constructor(file: File) {
    super(file.history);
    this.file = file;
  }

  readonly file: File;

  @computed get windowTitle(): string {
    return `${this.file.history.isModified ? "*" : ""}${
      this.file.fileName
    } - Macaron`;
  }

  getFileMenu(): MenuItem[] {
    return [
      {
        text: "New",
        run: action(() => {
          void this.file.clear();
          return true;
        }),
      },
      {
        type: "separator",
      },
      {
        text: "Open...",
        disabled: true,
      },
      {
        type: "separator",
      },
      {
        text: "Save",
        run: action(() => {
          void this.file.save();
          return true;
        }),
      },
      {
        text: "Save As...",
        run: action(() => {
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

      {
        text: "Edit",
        children: this.getEditMenu(),
      },
    ];
  }
}
