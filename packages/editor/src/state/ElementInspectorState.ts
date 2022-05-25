import { action, computed, makeObservable, observable } from "mobx";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { getIncrementalUniqueName } from "@seanchas116/paintkit/src/util/Name";
import { sameOrNone } from "@seanchas116/paintkit/src/util/Collection";
import { Element } from "../models/Element";
import { changeTagName } from "../services/ChangeTagName";
import { EditorState } from "./EditorState";

export class SpecificElementInspectorState {
  constructor(state: ElementInspectorState, tagName: string) {
    this.state = state;
    this.tagName = tagName;
    makeObservable(this);
  }

  readonly state: ElementInspectorState;
  readonly tagName: string;

  @computed get elements(): Element[] {
    return this.state.elements.filter((e) => e.tagName === this.tagName);
  }
}

export class ImgElementInspectorState extends SpecificElementInspectorState {
  constructor(state: ElementInspectorState) {
    super(state, "img");
    makeObservable(this);
  }

  @computed get src(): string | typeof MIXED | undefined {
    return sameOrMixed(this.elements.map((e) => e.attrs.get("src")));
  }

  readonly onSrcChange = action((src: string) => {
    for (const e of this.elements) {
      e.attrs.set("src", src);
    }
    return true;
  });
}

export class SlotElementInspectorState extends SpecificElementInspectorState {
  constructor(state: ElementInspectorState) {
    super(state, "slot");
    makeObservable(this);
  }

  @computed get name(): string | typeof MIXED | undefined {
    return sameOrMixed(this.elements.map((e) => e.attrs.get("name")));
  }

  readonly onNameChange = action((name: string) => {
    for (const e of this.elements) {
      e.attrs.set("name", name);
    }
    return true;
  });
}

export class ElementInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  @computed get elements(): Element[] {
    return this.editorState.document.selectedElementInstances.map(
      (i) => i.element
    );
  }

  @computed get isStyleableElementSelected(): boolean {
    return this.elements.some((element) => element.isStyleable);
  }

  @computed get isVisible(): boolean {
    return this.elements.length > 0;
  }

  @computed get tagName(): string | typeof MIXED | undefined {
    return sameOrMixed(this.elements.map((element) => element.tagName));
  }

  readonly onChangeTagName = action((tagName: string) => {
    for (const element of this.elements) {
      changeTagName(element, tagName);
    }
    this.editorState.history.commit("Change Tag Name");
    return true;
  });

  @computed get id(): string | typeof MIXED | undefined {
    return sameOrMixed(this.elements.map((element) => element.id));
  }

  readonly onChangeID = action((id: string) => {
    for (const element of this.elements) {
      element.setID(id);
    }
    this.editorState.history.commit("Change ID");
    return true;
  });

  // attributes

  @observable.ref selectedAttrKeys: ReadonlySet<string> = new Set();
  readonly onChangeSelectedAttrKeys = action(
    (keys: Set<string>) => (this.selectedAttrKeys = keys)
  );

  @computed get attrs(): Map<string, string | typeof MIXED> {
    const keys = new Set<string>();

    for (const element of this.elements) {
      for (const key of element.attrs.keys()) {
        keys.add(key);
      }
    }

    const attrs = new Map<string, string | typeof MIXED>();

    for (const key of keys) {
      const values = this.elements.map((element) => element.attrs.get(key));
      attrs.set(key, sameOrMixed(values) ?? MIXED);
    }

    return attrs;
  }

  addAttr(key: string, value: string): void {
    for (const element of this.elements) {
      element.attrs.set(key, value);
    }

    this.selectedAttrKeys = new Set([key]);
    this.editorState.history.commit("Add Attribute");
  }
  readonly onAddAttr = action(() => {
    const newKey = getIncrementalUniqueName(
      new Set(this.attrs.keys()),
      "data-new"
    );

    this.addAttr(newKey, "value");
  });

  deleteAttrs(): void {
    for (const key of this.selectedAttrKeys) {
      for (const element of this.elements) {
        element.attrs.delete(key);
      }
    }
    this.selectedAttrKeys = new Set();
    this.editorState.history.commit("Delete Attributes");
  }
  readonly onDeleteAttrs = action(this.deleteAttrs.bind(this));

  reorderAttrs(keys: string[]): void {
    for (const element of this.elements) {
      const newAttrs = new Map<string, string>();

      for (const key of keys) {
        const value = element.attrs.get(key);
        if (value) {
          newAttrs.set(key, value);
        }
      }

      element.attrs.replace(newAttrs);
    }

    this.editorState.history.commit("Reorder Attributes");
  }
  readonly onReorderAttrs = action(this.reorderAttrs.bind(this));

  changeAttrKey(key: string, newKey: string): boolean {
    for (const element of this.elements) {
      const value = element.attrs.get(key);
      if (value) {
        element.attrs.delete(key);
        element.attrs.set(newKey, value);
      }
    }

    this.editorState.history.commit("Change Attribute Key");
    return true;
  }
  readonly onChangeAttrKey = action(this.changeAttrKey.bind(this));

  changeAttrValue(key: string, value: string): boolean {
    for (const element of this.elements) {
      element.attrs.set(key, value);
    }

    this.editorState.history.commit("Change Attribute Value");
    return true;
  }
  readonly onChangeAttrValue = action(this.changeAttrValue.bind(this));

  // img

  readonly img = new ImgElementInspectorState(this);

  // slot

  readonly slot = new SlotElementInspectorState(this);

  @computed get slotTargetCandidates(): string[] {
    const commonParent = sameOrNone(this.elements.map((e) => e.parent));
    if (!commonParent) {
      return [];
    }

    const component = this.editorState.document.getCustomElementMetadata(
      commonParent.tagName
    );
    if (!component) {
      return [];
    }

    return component.slots.map((s) => s.name);
  }

  @computed get slotTarget(): string | typeof MIXED | undefined {
    return sameOrMixed(this.elements.map((e) => e.attrs.get("slot")));
  }

  readonly onChangeSlotTarget = action((src: string) => {
    for (const e of this.elements) {
      e.attrs.set("slot", src);
    }
    return true;
  });
}
