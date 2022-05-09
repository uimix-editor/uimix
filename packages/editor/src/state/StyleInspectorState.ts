import { isReplacedElement } from "@seanchas116/paintkit/src/util/HTMLTagCategory";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { startCase } from "lodash-es";
import { action, computed, makeObservable, observable } from "mobx";
import { ElementInstance } from "../models/ElementInstance";
import { ExtraStyleKey, extraStyleKeys } from "../models/Style";
import { EditorState } from "./EditorState";

export class StylePropertyState {
  constructor(state: StyleInspectorState, key: ExtraStyleKey) {
    this.state = state;
    this.key = key;
    makeObservable(this);
  }

  readonly state: StyleInspectorState;
  readonly key: ExtraStyleKey;

  @computed get targetInstances(): ElementInstance[] {
    switch (this.key) {
      case "objectFit":
        return this.state.imageInstances;
      case "color":
      case "fontFamily":
      case "fontWeight":
      case "fontStyle":
      case "fontSize":
      case "lineHeight":
      case "letterSpacing":
      case "textDecorationLine":
      case "textAlign":
        return this.state.nonReplacedInstances;
      default:
        return this.state.instances;
    }
  }

  @computed get computed(): string | undefined {
    const value = sameOrMixed(
      this.targetInstances.map((i) => i.computedStyle[this.key])
    );
    if (value === MIXED) {
      return;
    }
    return value;
  }

  @computed get value(): string | typeof MIXED | undefined {
    return sameOrMixed(this.targetInstances.map((i) => i.style[this.key]));
  }

  readonly onChangeWithoutCommit = action((value?: string) => {
    for (const instance of this.targetInstances) {
      instance.style[this.key] = value || undefined;
    }
    return true;
  });

  readonly onChangeCommit = action((value?: string) => {
    this.state.editorState.history.commit(`Change ${startCase(this.key)}`);
    return true;
  });

  readonly onChange = action((value?: string) => {
    for (const instance of this.targetInstances) {
      instance.style[this.key] = value || undefined;
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

  @computed get instances(): ElementInstance[] {
    return this.editorState.document.selectedElementInstances.filter(
      (instance) => instance.element.id
    );
  }

  @computed get imageInstances(): ElementInstance[] {
    // TODO: include other replaced elements?
    return this.instances.filter((i) => i.element.tagName === "img");
  }

  @computed get nonReplacedInstances(): ElementInstance[] {
    return this.instances.filter((i) => !isReplacedElement(i.element.tagName));
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

  @computed get mustAssignID(): boolean {
    return (
      this.instances.length === 0 &&
      this.editorState.document.selectedElementInstances.length > 0
    );
  }

  readonly onAssignID = action(() => {
    for (const instance of this.editorState.document.selectedElementInstances) {
      if (!instance.element.id) {
        instance.element.setID(instance.element.tagName);
      }
    }
    this.editorState.history.commit("Assign ID");
  });
}
