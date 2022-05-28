import { Command } from "@seanchas116/paintkit/src/components/menu/Menu";
import { isTextInputFocused } from "@seanchas116/paintkit/src/util/CurrentFocus";
import { KeyGesture } from "@seanchas116/paintkit/src/util/KeyGesture";
import { action, computed, makeObservable } from "mobx";
import { Component } from "../models/Component";
import { AutoLayout } from "../services/AutoLayout";
import { copyLayers, pasteLayers } from "../services/CopyPaste";
import {
  createComponentFromInstance,
  createEmptyComponent,
} from "../services/CreateComponent";
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
      onClick: action(() => {
        if (isTextInputFocused()) {
          return false;
        }
        void copyLayers(this.document).then(
          action(() => {
            this.document.deleteSelected();
          })
        );
        return true;
      }),
    };
  }

  @computed get copy(): Command {
    return {
      text: "Copy",
      shortcut: [new KeyGesture(["Command"], "KeyC")],
      onClick: action(() => {
        if (isTextInputFocused()) {
          return false;
        }
        void copyLayers(this.document);
        return true;
      }),
    };
  }

  @computed get paste(): Command {
    return {
      text: "Paste",
      shortcut: [new KeyGesture(["Command"], "KeyV")],
      onClick: action(() => {
        if (isTextInputFocused()) {
          return false;
        }
        void pasteLayers(this.editorState.document).then(
          action(() => {
            this.history.commit("Paste");
          })
        );
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
      text: `Undo ${this.history.undoStack.undoTitle ?? ""}`,
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
      text: `Redo ${this.history.undoStack.redoTitle ?? ""}`,
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

  @computed get createComponent(): Command {
    const selection = this.document.selectedElementInstances;

    return {
      text: "Create Component",
      shortcut: [new KeyGesture(["Command", "Alt"], "KeyK")],
      onClick: action(() => {
        const components: Component[] = [];

        if (selection.length) {
          for (const instance of selection) {
            components.push(
              createComponentFromInstance(this.editorState, instance)
            );
          }
        } else {
          components.push(createEmptyComponent(this.editorState));
        }

        this.document.deselect();
        for (const component of components) {
          component.defaultVariant.rootInstance.select();
        }

        this.history.commit("Create Component");
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
