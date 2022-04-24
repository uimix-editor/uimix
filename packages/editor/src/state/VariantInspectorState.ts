import { computed, makeObservable } from "mobx";
import { Variant } from "../models/Variant";
import { EditorState } from "./EditorState";

export class VariantInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  @computed get selectedVariants(): Variant[] {
    return this.editorState.document.selectedVariants;
  }

  @computed get isVisible(): boolean {
    return this.selectedVariants.length > 0;
  }
}
