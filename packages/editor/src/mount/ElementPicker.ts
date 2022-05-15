import { compact } from "lodash-es";
import { Document } from "../models/Document";
import { ElementInstance } from "../models/ElementInstance";
import { EditorState } from "../state/EditorState";
import { ElementMount } from "./ElementMount";
import { RootElementMount } from "./RootElementMount";

function clickableAncestor(
  document: Document,
  instanceAtPos: ElementInstance,
  type: "click" | "doubleClick"
): ElementInstance {
  const clickables = new Set<ElementInstance>();

  for (const selected of document.selectedElementInstances) {
    for (const descendantSelected of selected.ancestors) {
      const siblings = descendantSelected.parent?.children ?? [];
      for (const sibling of siblings) {
        if (sibling.type === "element") {
          clickables.add(sibling);
        }
      }
    }
  }

  let instance = instanceAtPos;
  let innerInstance = instanceAtPos;

  while (2 < instance.ancestors.length && !clickables.has(instance)) {
    innerInstance = instance;
    instance = instance.parent!;
  }

  if (type === "doubleClick") {
    return innerInstance;
  }

  return instance;
}

export class ElementPicker {
  constructor(editorState: EditorState) {
    this.editorState = editorState;
  }
  readonly editorState: EditorState;

  get document(): Document {
    return this.editorState.document;
  }

  root?: globalThis.Document;

  private instancesFromPoint(
    clientX: number,
    clientY: number
  ): ElementInstance[] {
    if (!this.root) {
      throw new Error("root not set");
    }

    const hostDOM = this.root.elementFromPoint(clientX, clientY);
    if (!hostDOM) {
      return [];
    }
    const rootMount = RootElementMount.forDOM(hostDOM);
    if (!rootMount) {
      return [];
    }
    if (!hostDOM.shadowRoot) {
      return [];
    }

    const doms = hostDOM.shadowRoot.elementsFromPoint(clientX, clientY);

    return [
      ...compact(doms.map((dom) => ElementMount.forDOM(dom)?.instance)),
      rootMount.instance,
    ];
  }

  pick(
    event: MouseEvent | DragEvent,
    mode: "click" | "doubleClick" = "click"
  ): ElementPickResult {
    const offset = this.editorState.scroll.viewportClientRect.topLeft;

    return new ElementPickResult(
      this.document,
      this.instancesFromPoint(
        event.clientX - offset.x,
        event.clientY - offset.y
      ),
      event,
      mode
    );
  }
}

export class ElementPickResult {
  constructor(
    document: Document,
    all: readonly ElementInstance[],
    event: MouseEvent | DragEvent,
    mode: "click" | "doubleClick"
  ) {
    this.document = document;
    this.all = all;
    this.event = event;
    this.mode = mode;
  }

  readonly document: Document;
  readonly all: readonly ElementInstance[];
  readonly event: MouseEvent | DragEvent;
  readonly mode: "click" | "doubleClick";

  get clickable(): ElementInstance | undefined {
    const instance = this.all[0];
    if (instance) {
      return clickableAncestor(this.document, instance, "click");
    }
  }

  get doubleClickable(): ElementInstance | undefined {
    const instance = this.all[0];
    if (instance) {
      return clickableAncestor(this.document, instance, "doubleClick");
    }
  }

  get default(): ElementInstance | undefined {
    if (this.mode === "doubleClick") {
      return this.doubleClickable;
    }

    return this.event.metaKey || this.event.ctrlKey
      ? this.all[0]
      : this.clickable;
  }
}
