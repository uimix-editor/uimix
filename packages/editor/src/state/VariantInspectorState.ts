import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { action, computed, makeObservable } from "mobx";
import { DefaultVariant, Variant } from "../models/Variant";
import { EditorState } from "./EditorState";

export class VariantInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  @computed get selectedAllVariants(): (Variant | DefaultVariant)[] {
    return this.editorState.document.selectedVariants;
  }

  @computed get isVisible(): boolean {
    return this.selectedAllVariants.length > 0;
  }

  @computed get selectedVariants(): Variant[] {
    return filterInstance(this.editorState.document.selectedVariants, [
      Variant,
    ]);
  }

  @computed get selector(): string | typeof MIXED | undefined {
    return sameOrMixed(this.selectedVariants.map((v) => v.selector));
  }

  readonly onChangeSelector = action((selector: string) => {
    for (const v of this.selectedVariants) {
      v.selector = selector;
    }
    this.editorState.history.commit("Change Variant Selector");
    return true;
  });
}
