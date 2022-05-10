import { Command } from "@seanchas116/paintkit/src/components/menu/Menu";
import { KeyGesture } from "@seanchas116/paintkit/src/util/KeyGesture";
import { action, computed, makeObservable, runInAction } from "mobx";
import { parseFragment, stringifyFragment } from "../models/FileFormat";
import { AutoLayout } from "../services/AutoLayout";
import { EditorState } from "./EditorState";

export class Commands {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  private readonly editorState: EditorState;

  private get document() {
    return this.editorState.document;
  }
  private get history() {
    return this.editorState.history;
  }
  private get scroll() {
    return this.editorState.scroll;
  }

  @computed get cut(): Command {
    return {
      text: "Cut",
      shortcut: [new KeyGesture(["Command"], "KeyX")],
      // TODO
    };
  }

  @computed get copy(): Command {
    return {
      text: "Copy",
      shortcut: [new KeyGesture(["Command"], "KeyC")],
      onClick: action(() => {
        const fragment = this.document.selectedFragment;
        if (fragment) {
          const html = stringifyFragment(fragment);

          const type = "text/html";
          const blob = new Blob([html], { type });
          const data = [new ClipboardItem({ [type]: blob })];

          void navigator.clipboard.write(data);
        }

        return true;
      }),
    };
  }

  @computed get paste(): Command {
    return {
      text: "Paste",
      shortcut: [new KeyGesture(["Command"], "KeyV")],
      onClick: action(() => {
        void navigator.clipboard.read().then(async (contents) => {
          for (const item of contents) {
            if (item.types.includes("text/html")) {
              const html = await (await item.getType("text/html")).text();
              const fragment = parseFragment(html);
              if (fragment) {
                runInAction(() => {
                  this.document.appendFragmentBeforeSelection(fragment);
                  this.history.commit("Paste");
                });
              }

              break;
            }
          }
        });

        return true;
      }),
    };
  }

  @computed get delete(): Command {
    return {
      text: "Delete",
      shortcut: [new KeyGesture([], "Backspace")],
      onClick: action(() => {
        this.document.deleteSelected();
        this.history.commit("Delete Element");
        return true;
      }),
    };
  }

  @computed get undo(): Command {
    return {
      text: "Undo",
      disabled: !this.history.undoStack.canUndo,
      shortcut: [new KeyGesture(["Command"], "KeyZ")],
      onClick: action(() => {
        this.history.undoStack.undo();
        return true;
      }),
    };
  }

  @computed get redo(): Command {
    return {
      text: "Redo",
      disabled: !this.history.undoStack.canRedo,
      shortcut: [
        new KeyGesture(["Command", "Shift"], "KeyZ"),
        new KeyGesture(["Command"], "KeyY"),
      ],
      onClick: action(() => {
        this.history.undoStack.redo();
        return true;
      }),
    };
  }

  @computed get groupIntoFlex(): Command {
    return {
      text: "Group into Flex Container",
      shortcut: [new KeyGesture(["Command"], "KeyG")],
      disabled: this.document.selectedElementInstances.length < 2,
      onClick: action(() => {
        const flexbox = AutoLayout.groupElementsIntoFlex(
          this.document.selectedElementInstances
        );
        if (flexbox) {
          this.document.deselect();
          flexbox.select();
          this.history.commit("Group into Flex Container");
        }
        return true;
      }),
    };
  }

  @computed get autoLayoutChildren(): Command {
    const selection = this.document.selectedElementInstances;

    return {
      text: "Auto-layout Children",
      disabled:
        selection.length < 1 ||
        selection.some(
          (instance) => !AutoLayout.canAutoLayoutChildren(instance)
        ),
      onClick: action(() => {
        for (const instance of selection) {
          AutoLayout.autoLayoutChildren(instance);
        }
        this.history.commit("Auto-layout Children");
        return true;
      }),
    };
  }

  @computed get zoomIn(): Command {
    return {
      text: "Zoom In",
      shortcut: [
        new KeyGesture([], "Equal"),
        new KeyGesture([], "NumpadAdd"),
        new KeyGesture(["Command"], "Equal"),
        new KeyGesture(["Command"], "NumpadAdd"),
        new KeyGesture(["Shift"], "Equal"),
        new KeyGesture(["Shift", "Command"], "Equal"),
      ],
      onClick: action(() => {
        this.scroll.zoomIn();
        return true;
      }),
    };
  }

  @computed get zoomOut(): Command {
    return {
      text: "Zoom Out",
      shortcut: [
        new KeyGesture([], "Minus"),
        new KeyGesture([], "NumpadSubtract"),
        new KeyGesture(["Command"], "Minus"),
        new KeyGesture(["Command"], "NumpadSubtract"),
        new KeyGesture(["Shift"], "Minus"),
        new KeyGesture(["Shift", "Command"], "Minus"),
      ],
      onClick: action(() => {
        this.scroll.zoomOut();
        return true;
      }),
    };
  }
}
