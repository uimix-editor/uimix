import { sameOrNone } from "@seanchas116/paintkit/src/util/Collection";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { startCase } from "lodash-es";
import { action, computed, makeObservable, observable } from "mobx";
import { ElementInstance } from "../models/ElementInstance";
import { Style, StyleKey, styleKeys } from "../models/Style";
import { EditorState } from "./EditorState";

class StylePropertyState {
  constructor(state: StyleInspectorState, key: StyleKey) {
    this.state = state;
    this.key = key;
    makeObservable(this);
  }

  readonly state: StyleInspectorState;
  readonly key: StyleKey;

  @computed get computed(): string | undefined {
    return sameOrNone(
      this.state.computedStyles.map((style) => style[this.key])
    );
  }

  @computed get value(): string | typeof MIXED | undefined {
    return sameOrMixed(this.state.styles.map((style) => style[this.key]));
  }

  readonly onChangeWithoutCommit = action((value?: string) => {
    for (const style of this.state.styles) {
      style[this.key] = value || undefined;
    }
    return true;
  });

  readonly onChange = action((value?: string) => {
    for (const style of this.state.styles) {
      style[this.key] = value || undefined;
    }
    this.state.editorState.history.commit(`Change ${startCase(this.key)}`);
    return true;
  });
}

export class StyleInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);

    this.props = Object.fromEntries(
      styleKeys.map((key) => [key, new StylePropertyState(this, key)])
    ) as Record<StyleKey, StylePropertyState>;
  }

  readonly editorState: EditorState;

  @computed get selectedInstances(): ElementInstance[] {
    return this.editorState.document.selectedElementInstances;
  }

  @computed get styles(): Style[] {
    return this.selectedInstances.map((instance) => instance.style);
  }
  @computed get computedStyles(): Style[] {
    return this.selectedInstances.map((instance) => instance.computedStyle);
  }

  readonly props: Record<StyleKey, StylePropertyState>;

  @observable showsSizeDetails = false;

  readonly onToggleShowSizeDetails = action(() => {
    this.showsSizeDetails = !this.showsSizeDetails;
  });
}
