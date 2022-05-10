import { action, computed, makeObservable, observable } from "mobx";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import { getIncrementalUniqueName } from "@seanchas116/paintkit/src/util/Name";
import { Element } from "../models/Element";
import { EditorState } from "./EditorState";

export class ElementInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  @computed get selectedElements(): Element[] {
    return filterInstance(this.editorState.document.selectedNodes, [Element]);
  }

  @computed get isVisible(): boolean {
    return this.selectedElements.length > 0;
  }

  @computed get tagName(): string | typeof MIXED | undefined {
    return sameOrMixed(this.selectedElements.map((element) => element.tagName));
  }

  readonly onChangeTagName = action((tagName: string) => {
    for (const element of this.selectedElements) {
      if (!element.parent) {
        continue;
      }

      // TODO: keep selection
      // TODO: keep treeview collapsed/expanded state

      const newElement = new Element({ tagName });
      newElement.setID(element.id);
      newElement.attrs.replace(element.attrs);

      for (const child of element.children) {
        newElement.append(child);
      }

      const next = element.nextSibling;
      const parent = element.parent;
      element.remove();
      parent.insertBefore(newElement, next);
    }

    this.editorState.history.commit("Change Tag Name");

    return true;
  });

  @computed get id(): string | typeof MIXED | undefined {
    return sameOrMixed(this.selectedElements.map((element) => element.id));
  }

  readonly onChangeID = action((id: string) => {
    for (const element of this.selectedElements) {
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

    for (const element of this.selectedElements) {
      for (const key of element.attrs.keys()) {
        keys.add(key);
      }
    }

    const attrs = new Map<string, string | typeof MIXED>();

    for (const key of keys) {
      const values = this.selectedElements.map((element) =>
        element.attrs.get(key)
      );
      attrs.set(key, sameOrMixed(values) ?? MIXED);
    }

    return attrs;
  }

  addAttr(key: string, value: string): void {
    for (const element of this.selectedElements) {
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
      for (const element of this.selectedElements) {
        element.attrs.delete(key);
      }
    }
    this.selectedAttrKeys = new Set();
    this.editorState.history.commit("Delete Attributes");
  }
  readonly onDeleteAttrs = action(this.deleteAttrs.bind(this));

  reorderAttrs(keys: string[]): void {
    for (const element of this.selectedElements) {
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
    for (const element of this.selectedElements) {
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
    for (const element of this.selectedElements) {
      element.attrs.set(key, value);
    }

    this.editorState.history.commit("Change Attribute Value");
    return true;
  }
  readonly onChangeAttrValue = action(this.changeAttrValue.bind(this));

  // img

  @computed get selectedImgElements(): Element[] {
    return this.selectedElements.filter((e) => e.tagName === "img");
  }

  @computed get imgSrc(): string | typeof MIXED | undefined {
    return sameOrMixed(this.selectedImgElements.map((e) => e.attrs.get("src")));
  }

  readonly onImgSrcChange = action((src: string) => {
    for (const e of this.selectedImgElements) {
      e.attrs.set("src", src);
    }
    return true;
  });
}
