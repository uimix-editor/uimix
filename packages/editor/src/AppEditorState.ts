import { MenuItem } from "@seanchas116/paintkit/dist/components/menu/Menu";
import { EditorState } from "./state/EditorState";

export class AppEditorState extends EditorState {
  getFileMenu(): MenuItem[] {
    return [
      {
        text: "New",
      },
      {
        type: "separator",
      },
      {
        text: "Open...",
      },
      {
        type: "separator",
      },
      {
        text: "Save",
      },
      {
        text: "Save As...",
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
