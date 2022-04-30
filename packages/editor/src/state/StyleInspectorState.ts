import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { startCase } from "lodash-es";
import { action, computed, makeObservable } from "mobx";
import { ElementInstance } from "../models/ElementInstance";
import { Style, StyleKey } from "../models/Style";
import { EditorState } from "./EditorState";

class StylePropertyState {
  constructor(state: StyleInspectorState, key: StyleKey) {
    this.state = state;
    this.key = key;
    makeObservable(this);
  }

  readonly state: StyleInspectorState;
  readonly key: StyleKey;

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
  }

  readonly editorState: EditorState;

  @computed get selectedInstances(): ElementInstance[] {
    return this.editorState.document.selectedElementInstances;
  }

  @computed get styles(): Style[] {
    return this.selectedInstances.map((instance) => instance.style);
  }

  readonly fontFamily = new StylePropertyState(this, "fontFamily");
  readonly fontWeight = new StylePropertyState(this, "fontWeight");
  readonly color = new StylePropertyState(this, "color");
}
