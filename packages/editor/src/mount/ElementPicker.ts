import { compact } from "lodash-es";
import { Document } from "../models/Document";
import { ElementInstance } from "../models/ElementInstance";
import { ElementMount } from "./ElementMount";

function elementsFromPointRecursive(
  root: DocumentOrShadowRoot,
  clientX: number,
  clientY: number
): Element[] {
  return root.elementsFromPoint(clientX, clientY).flatMap((element) => {
    if (element.shadowRoot) {
      return [
        ...elementsFromPointRecursive(element.shadowRoot, clientX, clientY),
        element,
      ];
    }
    return [element];
  });
}

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

  while (1 < instance.ancestors.length && !clickables.has(instance)) {
    innerInstance = instance;
    instance = instance.parent!;
  }

  if (type === "doubleClick") {
    return innerInstance;
  }

  return instance;
}

export class ElementPicker {
  constructor(document: Document) {
    this.document = document;
  }
  readonly document: Document;

  root?: DocumentOrShadowRoot;

  pick(event: MouseEvent | DragEvent): ElementPickResult {
    if (!this.root) {
      throw new Error("root not set");
    }

    const doms = elementsFromPointRecursive(
      this.root,
      event.clientX,
      event.clientY
    );
    return new ElementPickResult(
      this.document,
      event,
      compact(doms.map((elem) => ElementMount.forDOM(elem)?.instance))
    );
  }
}

export class ElementPickResult {
  constructor(
    document: Document,
    event: MouseEvent | DragEvent,
    all: readonly ElementInstance[]
  ) {
    this.document = document;
    this.event = event;
    this.all = all;
  }

  readonly document: Document;
  readonly event: MouseEvent | DragEvent;
  readonly all: readonly ElementInstance[];

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
    return this.event.metaKey || this.event.ctrlKey
      ? this.all[0]
      : this.clickable;
  }
}
