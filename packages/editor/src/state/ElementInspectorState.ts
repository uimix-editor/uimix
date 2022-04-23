import { action, computed, makeObservable } from "mobx";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { Element } from "../models/Element";
import { EditorState } from "./EditorState";

export class ElementInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  @computed get selectedElements(): Element[] {
    return filterInstance(this.editorState.document.selectedNodes, [Element]);
  }

  @computed get tagName(): string | typeof MIXED | undefined {
    return sameOrMixed(this.selectedElements.map((element) => element.tagName));
  }

  @computed get id(): string | typeof MIXED | undefined {
    return sameOrMixed(this.selectedElements.map((element) => element.id));
  }

  readonly onChangeID = action((id: string) => {
    for (const element of this.selectedElements) {
      element.setID(id);
    }
    this.editorState.history.commit("Change ID");
    return true;
  });
}
