import { computed, makeObservable } from "mobx";
import { ElementInstance } from "../models/ElementInstance";
import { EditorState } from "./EditorState";

export class StyleInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  @computed get selectedInstances(): ElementInstance[] {
    return this.editorState.document.selectedElementInstances;
  }
}
