import {
  isReplacedElement,
  isSVGTagName,
} from "@seanchas116/paintkit/src/util/HTMLTagCategory";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { startCase } from "lodash-es";
import { action, computed, makeObservable, observable } from "mobx";
import { CustomElementMetadata } from "../models/CustomElementMetadata";
import { ElementInstance } from "../models/ElementInstance";
import {
  AllStyleKey,
  allStyleKeys,
  imageStyleKeys,
  textStyleKeys,
} from "../models/Style";
import { EditorState } from "./EditorState";

export class StylePropertyState {
  constructor(state: StyleInspectorState, key: AllStyleKey) {
    this.state = state;
    this.key = key;
    makeObservable(this);
  }

  readonly state: StyleInspectorState;
  readonly key: AllStyleKey;

  @computed get targetInstances(): ElementInstance[] {
    if (this.key === "color") {
      return [...this.state.textInstances, ...this.state.svgInstances];
    }

    if (imageStyleKeys.includes(this.key as never)) {
      return this.state.imageInstances;
    }
    if (textStyleKeys.includes(this.key as never)) {
      return this.state.textInstances;
    }
    return this.state.instances;
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

  readonly onChangeWithoutCommit = action((value: string | undefined) => {
    for (const instance of this.targetInstances) {
      instance.style[this.key] = value || undefined;

      if (this.key === "width") {
        if (!instance.parent && instance.variant) {
          if (value) {
            instance.variant.width = undefined;
          }
        }
      }
    }
    return true;
  });

  readonly onCommit = action(() => {
    this.state.editorState.history.commit(`Change ${startCase(this.key)}`);
    return true;
  });

  readonly onChange = action((value: string | undefined) => {
    this.onChangeWithoutCommit(value);
    this.onCommit();
    return true;
  });
}

export class StyleCustomPropertyState {
  constructor(state: StyleInspectorState, key: string) {
    this.state = state;
    this.key = key;
    makeObservable(this);
  }

  readonly state: StyleInspectorState;
  readonly key: string;

  get targetInstances(): ElementInstance[] {
    return this.state.instances;
  }

  @computed get value(): string | typeof MIXED | undefined {
    return sameOrMixed(
      this.targetInstances.map((i) => i.style.customProps.get(this.key))
    );
  }

  readonly onChangeWithoutCommit = action((value: string | undefined) => {
    for (const instance of this.targetInstances) {
      if (value) {
        instance.style.customProps.set(this.key, value);
      } else {
        instance.style.customProps.delete(this.key);
      }
    }
    return true;
  });

  readonly onCommit = action(() => {
    this.state.editorState.history.commit(`Change ${startCase(this.key)}`);
    return true;
  });

  readonly onChange = action((value: string | undefined) => {
    this.onChangeWithoutCommit(value);
    this.onCommit();
    return true;
  });
}

export class StyleInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);

    this.props = Object.fromEntries(
      allStyleKeys.map((key) => [key, new StylePropertyState(this, key)])
    ) as Record<AllStyleKey, StylePropertyState>;
  }

  readonly editorState: EditorState;

  @computed private get selectedNonSVGInstances(): ElementInstance[] {
    return this.editorState.document.selectedElementInstances.filter(
      (instance) => {
        if (!isSVGTagName(instance.element.tagName)) {
          return true;
        }
        if (instance.element.tagName === "svg") {
          return true;
        }
        return false;
      }
    );
  }

  @computed get instances(): ElementInstance[] {
    return this.selectedNonSVGInstances.filter(
      (instance) => instance.element.id || !instance.element.parent
    );
  }

  @computed get imageInstances(): ElementInstance[] {
    // TODO: include other replaced elements?
    return this.instances.filter((i) => i.element.tagName === "img");
  }

  @computed get textInstances(): ElementInstance[] {
    return this.instances.filter(
      (i) =>
        !isReplacedElement(i.element.tagName) && i.element.tagName !== "svg"
    );
  }

  @computed get svgInstances(): ElementInstance[] {
    return this.instances.filter((i) => i.element.tagName === "svg");
  }

  @computed get tagName(): string | typeof MIXED | undefined {
    return sameOrMixed(this.instances.map((i) => i.element.tagName));
  }

  @computed get customElementMetadata(): CustomElementMetadata | undefined {
    const { tagName } = this;
    if (typeof tagName === "string") {
      return this.editorState.document.getCustomElementMetadata(tagName);
    }
  }

  readonly props: Record<AllStyleKey, StylePropertyState>;

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
      this.instances.length === 0 && this.selectedNonSVGInstances.length > 0
    );
  }

  readonly onAssignID = action(() => {
    for (const instance of this.selectedNonSVGInstances) {
      if (!instance.element.id) {
        instance.element.setID(instance.element.tagName);
      }
    }
    this.editorState.history.commit("Assign ID");
  });

  @computed get computedParentDisplay(): string | undefined | typeof MIXED {
    return sameOrMixed(
      this.instances.map((i) => i.parent?.computedStyle.display)
    );
  }

  @computed get computedParentFlexDirection():
    | string
    | undefined
    | typeof MIXED {
    return sameOrMixed(
      this.instances.map((i) => i.parent?.computedStyle.flexDirection)
    );
  }
}
