import { Command } from "@seanchas116/paintkit/src/components/menu/Menu";
import { KeyGesture } from "@seanchas116/paintkit/src/util/KeyGesture";
import { action, computed, makeObservable } from "mobx";
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
}
