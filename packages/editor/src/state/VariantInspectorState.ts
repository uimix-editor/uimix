import { computed, makeObservable } from "mobx";
import { DefaultVariant, Variant } from "../models/Variant";
import { EditorState } from "./EditorState";

export class VariantInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  @computed get selectedVariants(): (Variant | DefaultVariant)[] {
    return this.editorState.document.selectedVariants;
  }

  @computed get isVisible(): boolean {
    return this.selectedVariants.length > 0;
  }
}
