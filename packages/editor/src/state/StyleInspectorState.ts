import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { startCase } from "lodash-es";
import { action, computed, makeObservable, observable } from "mobx";
import { ElementInstance } from "../models/ElementInstance";
import { ExtraStyleKey, extraStyleKeys, Style } from "../models/Style";
import { EditorState } from "./EditorState";

export class StylePropertyState {
  constructor(state: StyleInspectorState, key: ExtraStyleKey) {
    this.state = state;
    this.key = key;
    makeObservable(this);
  }

  readonly state: StyleInspectorState;
  readonly key: ExtraStyleKey;

  @computed get computed(): string | undefined {
    const value = sameOrMixed(
      this.state.computedStyles.map((style) => style[this.key])
    );
    if (value === MIXED) {
      return;
    }
    return value;
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

  readonly onChangeCommit = action((value?: string) => {
    this.state.editorState.history.commit(`Change ${startCase(this.key)}`);
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
      extraStyleKeys.map((key) => [key, new StylePropertyState(this, key)])
    ) as Record<ExtraStyleKey, StylePropertyState>;
  }

  readonly editorState: EditorState;

  @computed get selectedInstances(): ElementInstance[] {
    return this.editorState.document.selectedElementInstances.filter(
      (instance) => instance.element.id
    );
  }

  @computed get styles(): Style[] {
    return this.selectedInstances.map((instance) => instance.style);
  }
  @computed get computedStyles(): Style[] {
    return this.selectedInstances.map((instance) => instance.computedStyle);
  }

  readonly props: Record<ExtraStyleKey, StylePropertyState>;

  @observable showsSizeDetails = false;

  readonly onToggleShowSizeDetails = action(() => {
    this.showsSizeDetails = !this.showsSizeDetails;
  });

  @observable showsSeparateRadiuses = false;

  readonly onToggleShowSeparateRadiuses = action(() => {
    this.showsSeparateRadiuses = !this.showsSeparateRadiuses;
  });

  @observable borderEdgeMode: "all" | "top" | "right" | "bottom" | "left" =
    "all";

  readonly setBorderEdgeModeToAll = action(() => {
    this.borderEdgeMode = "all";
  });
  readonly setBorderEdgeModeToTop = action(() => {
    this.borderEdgeMode = "top";
  });
  readonly setBorderEdgeModeToRight = action(() => {
    this.borderEdgeMode = "right";
  });
  readonly setBorderEdgeModeToBottom = action(() => {
    this.borderEdgeMode = "bottom";
  });
  readonly setBorderEdgeModeToLeft = action(() => {
    this.borderEdgeMode = "left";
  });
}
