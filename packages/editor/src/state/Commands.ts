import { Command } from "@seanchas116/paintkit/src/components/menu/Menu";
import { isTextInputFocused } from "@seanchas116/paintkit/src/util/CurrentFocus";
import { KeyGesture } from "@seanchas116/paintkit/src/util/KeyGesture";
import { action, computed, makeObservable, runInAction } from "mobx";
import { Component } from "../models/Component";
import { Element } from "../models/Element";
import { getInstance } from "../models/InstanceRegistry";
import { Text } from "../models/Text";
import { AutoLayout } from "../services/AutoLayout";
import {
  copyFragments,
  copyHTML,
  copyStyle,
  pasteFragments,
  pasteHTML,
  pasteStyle,
} from "../services/CopyPaste";
import {
  createComponentFromExistingInstance,
  createEmptyComponent,
} from "../services/CreateComponent";
import { EditorState } from "./EditorState";

function withAnalytics(command: Command): Command {
  const newCommand = { ...command };
  const { onClick } = command;
  if (onClick) {
    newCommand.onClick = () => {
      const ret = onClick();
      plausible("command", {
        props: {
          text: command.text,
        },
      });
      return ret;
    };
  }
  return newCommand;
}

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
    return withAnalytics({
      text: "Cut",
      shortcut: [new KeyGesture(["Command"], "KeyX")],
      onClick: action(() => {
        if (isTextInputFocused()) {
          return false;
        }
        void copyFragments(this.document).then(
          action(() => {
            this.document.deleteSelected();
          })
        );
        return true;
      }),
    });
  }

  @computed get copy(): Command {
    return withAnalytics({
      text: "Copy",
      shortcut: [new KeyGesture(["Command"], "KeyC")],
      onClick: action(() => {
        if (isTextInputFocused()) {
          return false;
        }
        void copyFragments(this.document);
        return true;
      }),
    });
  }

  @computed get paste(): Command {
    return withAnalytics({
      text: "Paste",
      shortcut: [new KeyGesture(["Command"], "KeyV")],
      onClick: action(() => {
        if (isTextInputFocused()) {
          return false;
        }
        void pasteFragments(this.editorState).then(
          action(() => {
            this.history.commit("Paste");
          })
        );
        return true;
      }),
    });
  }

  @computed get delete(): Command {
    return withAnalytics({
      text: "Delete",
      shortcut: [new KeyGesture([], "Backspace")],
      onClick: action(() => {
        this.document.deleteSelected();
        this.history.commit("Delete Element");
        return true;
      }),
    });
  }

  @computed get selectAll(): Command {
    return withAnalytics({
      text: "Select All",
      shortcut: [new KeyGesture(["Command"], "KeyA")],
      onClick: action(() => {
        if (isTextInputFocused()) {
          return false;
        }
        this.document.selectAll();
        return true;
      }),
    });
  }

  @computed get copyStyle(): Command {
    return withAnalytics({
      text: "Copy Style",
      shortcut: [new KeyGesture(["Command", "Alt"], "KeyC")],
      disabled: !this.document.selectedElementInstances.length,
      onClick: () => {
        const instance = this.document.selectedElementInstances[0];
        void copyStyle(instance);
        return true;
      },
    });
  }

  @computed get pasteStyle(): Command {
    return withAnalytics({
      text: "Paste Style",
      shortcut: [new KeyGesture(["Command", "Alt"], "KeyV")],
      disabled: !this.document.selectedElementInstances.length,
      onClick: () => {
        const instance = this.document.selectedElementInstances[0];
        void pasteStyle(instance);
        return true;
      },
    });
  }

  @computed get copyHTML(): Command {
    return withAnalytics({
      text: "Copy HTML/SVG",
      onClick: action(() => {
        if (isTextInputFocused()) {
          return false;
        }
        void copyHTML(this.document);
        return true;
      }),
    });
  }

  @computed get pasteHTML(): Command {
    return withAnalytics({
      text: "Paste HTML/SVG",
      onClick: () => {
        void pasteHTML(this.editorState);
        return true;
      },
    });
  }

  @computed get undo(): Command {
    return withAnalytics({
      text: `Undo ${this.history.undoStack.undoTitle ?? ""}`,
      disabled: !this.history.undoStack.canUndo,
      shortcut: [new KeyGesture(["Command"], "KeyZ")],
      onClick: action(() => {
        this.history.undoStack.undo();
        return true;
      }),
    });
  }

  @computed get redo(): Command {
    return withAnalytics({
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
    });
  }

  @computed get insertFrame(): Command {
    return withAnalytics({
      text: "Frame",
      shortcut: [new KeyGesture([], "KeyF"), new KeyGesture([], "KeyR")],
      selected: this.editorState.insertMode === "frame",
      onClick: action(() => {
        this.editorState.insertMode = "frame";
        return true;
      }),
    });
  }

  @computed get insertText(): Command {
    return withAnalytics({
      text: "Text",
      shortcut: [new KeyGesture([], "KeyT")],
      selected: this.editorState.insertMode === "text",
      onClick: action(() => {
        this.editorState.insertMode = "text";
        return true;
      }),
    });
  }

  @computed get insertImage(): Command {
    return withAnalytics({
      text: "Image",
      selected: this.editorState.insertMode === "image",
      onClick: action(() => {
        this.editorState.insertMode = "image";
        return true;
      }),
    });
  }

  @computed get groupIntoFlex(): Command {
    return withAnalytics({
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
    });
  }

  @computed get autoLayoutChildren(): Command {
    const selection = this.document.selectedElementInstances;

    return withAnalytics({
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
    });
  }

  @computed get createComponent(): Command {
    const selection = this.document.selectedElementInstances;

    return withAnalytics({
      text: "Create Component",
      shortcut: [new KeyGesture(["Command", "Alt"], "KeyK")],
      onClick: action(() => {
        void (async () => {
          const components: Component[] = [];

          if (selection.length) {
            for (const instance of selection) {
              components.push(
                await createComponentFromExistingInstance(
                  this.editorState,
                  instance
                )
              );
            }
          } else {
            components.push(createEmptyComponent(this.editorState));
          }

          runInAction(() => {
            this.document.deselect();
            for (const component of components) {
              component.defaultVariant.rootInstance.select();
            }

            this.history.commit("Create Component");
          });
        })();

        return true;
      }),
    });
  }

  @computed get addElement(): Command {
    return withAnalytics({
      text: "Add Element",
      disabled: this.document.selectedElementInstances.length < 1,
      onClick: action(() => {
        const instance = this.document.selectedElementInstances[0];

        const element = new Element({ tagName: "div" });
        element.rename("div");
        instance.element.append(element);

        const addedInstance = getInstance(instance.variant, element);
        this.document.deselect();
        addedInstance.select();

        this.history.commit("Add Element");
        return true;
      }),
    });
  }

  @computed get addText(): Command {
    return withAnalytics({
      text: "Add Text",
      disabled: this.document.selectedElementInstances.length < 1,
      onClick: action(() => {
        const instance = this.document.selectedElementInstances[0];

        const text = new Text({ content: "Text" });
        instance.element.append(text);

        const addedInstance = getInstance(instance.variant, text);
        this.document.deselect();
        addedInstance.select();

        this.history.commit("Add Text");
        return true;
      }),
    });
  }

  @computed get wrapContentsInSlot(): Command {
    return withAnalytics({
      text: "Wrap Contents in Slot",
      onClick: action(() => {
        for (const instance of this.document.selectedElementInstances) {
          const slot = new Element({ tagName: "slot" });
          slot.append(...instance.element.children);
          instance.element.append(slot);

          const slotInstance = getInstance(instance.variant, slot);
          this.document.deselect();
          slotInstance.select();
          slotInstance.collapsed = false;
        }

        this.history.commit("Wrap Contents in Slot");
        return true;
      }),
    });
  }

  @computed get zoomIn(): Command {
    return withAnalytics({
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
    });
  }

  @computed get zoomOut(): Command {
    return withAnalytics({
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
    });
  }
}
