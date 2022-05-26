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

  @computed get x(): number | typeof MIXED | undefined {
    return sameOrMixed(this.selectedAllVariants.map((v) => v.x));
  }
  @computed get y(): number | typeof MIXED | undefined {
    return sameOrMixed(this.selectedAllVariants.map((v) => v.y));
  }
  @computed get width(): number | typeof MIXED | undefined {
    return sameOrMixed(this.selectedAllVariants.map((v) => v.width));
  }
  @computed get height(): number | typeof MIXED | undefined {
    return sameOrMixed(this.selectedAllVariants.map((v) => v.height));
  }
  @computed get backgroundColor(): string | typeof MIXED | undefined {
    return sameOrMixed(this.selectedAllVariants.map((v) => v.backgroundColor));
  }

  readonly onXChange = action((x?: number) => {
    if (x == null) {
      return false;
    }

    for (const variant of this.selectedAllVariants) {
      variant.x = x;
    }
    this.editorState.history.commit("Change X");
    return true;
  });

  readonly onYChange = action((y?: number) => {
    if (y == null) {
      return false;
    }

    for (const variant of this.selectedAllVariants) {
      variant.y = y;
    }
    this.editorState.history.commit("Change Y");
    return true;
  });

  readonly onWidthChange = action((width?: number) => {
    for (const variant of this.selectedAllVariants) {
      variant.width = width;
    }
    this.editorState.history.commit("Change Width");
    return true;
  });

  readonly onHeightChange = action((height?: number) => {
    for (const variant of this.selectedAllVariants) {
      variant.height = height;
    }
    this.editorState.history.commit("Change Height");
    return true;
  });

  readonly onBackgroundColorChange = action((backgroundColor?: string) => {
    for (const variant of this.selectedAllVariants) {
      variant.backgroundColor = backgroundColor;
    }
    this.editorState.history.commit("Change Background Color");
    return true;
  });

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

  @computed get mediaQuery(): string | typeof MIXED | undefined {
    return sameOrMixed(this.selectedVariants.map((v) => v.mediaQuery));
  }

  readonly onChangeMediaQuery = action((mediaQuery: string) => {
    for (const v of this.selectedVariants) {
      v.mediaQuery = mediaQuery;
    }
    this.editorState.history.commit("Change Variant Media Query");
    return true;
  });
}
