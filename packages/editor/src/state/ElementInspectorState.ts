import { action, computed, makeObservable } from "mobx";
import { MIXED, sameOrMixed } from "@seanchas116/paintkit/src/util/Mixed";
import { filterInstance } from "@seanchas116/paintkit/src/util/Collection";
import prettier from "prettier/standalone";
import parserHTML from "prettier/parser-html";
import { toHtml } from "hast-util-to-html";
import { Element } from "../models/Element";
import { EditorState } from "./EditorState";

export function formatHTML(html: string): string {
  return prettier.format(html, {
    parser: "html",
    plugins: [parserHTML],
  });
}

export class ElementInspectorState {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
    makeObservable(this);
  }

  readonly editorState: EditorState;

  @computed get selectedElements(): Element[] {
    return filterInstance(this.editorState.document.selectedNodes, [Element]);
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

  @computed get innerHTML(): string | typeof MIXED | undefined {
    const value = sameOrMixed(
      this.selectedElements.map((element) => toHtml(element.innerHTML))
    );
    if (typeof value === "string") {
      return formatHTML(value);
    }
    return value;
  }
}
