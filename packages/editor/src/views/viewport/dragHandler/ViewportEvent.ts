import { Vec2 } from "paintvec";
import { Selectable } from "../../../models/Selectable";
import { projectState } from "../../../state/ProjectState";
import { scrollState } from "../../../state/ScrollState";
import { assertNonNull } from "../../../utils/Assert";
import { nodePicker } from "../renderer/NodePicker";

function clickableAncestor(
  instanceAtPos: Selectable,
  type: "click" | "doubleClick"
): Selectable {
  const clickables = new Set<Selectable>();

  for (const selected of projectState.selectedSelectables) {
    for (const descendantSelected of selected.ancestors) {
      const siblings = descendantSelected.parent?.children ?? [];
      for (const sibling of siblings) {
        clickables.add(sibling);
      }
    }
  }
  for (const selectable of projectState.page?.selectable.children ?? []) {
    if (selectable.originalNode.type === "component") {
      for (const child of selectable.children) {
        clickables.add(child);
      }
    }
  }

  let instance = instanceAtPos;
  let innerInstance = instanceAtPos;

  while (3 < instance.ancestors.length && !clickables.has(instance)) {
    innerInstance = instance;
    instance = assertNonNull(instance.parent);
  }

  if (type === "doubleClick") {
    return innerInstance;
  }

  return instance;
}

export class ViewportEvent {
  constructor(
    event: MouseEvent | DragEvent,
    options: {
      all?: readonly Selectable[];
      clientPos?: Vec2;
      pos?: Vec2;
      mode?: "click" | "doubleClick";
    } = {}
  ) {
    const clientPos =
      options.clientPos ?? new Vec2(event.clientX, event.clientY);

    this.selectables =
      options.all ?? nodePicker.instancesFromPoint(clientPos.x, clientPos.y);
    this.clientPos = clientPos;
    this.pos = options.pos ?? scrollState.documentPosForClientPos(clientPos);
    this.event = event;
    this.mode = options.mode ?? "click";
  }

  readonly selectables: readonly Selectable[];
  readonly clientPos: Vec2;
  readonly pos: Vec2;
  readonly event: MouseEvent | DragEvent;
  readonly mode: "click" | "doubleClick";

  get clickableSelectable(): Selectable | undefined {
    const instance = this.selectables[0];
    if (instance) {
      return clickableAncestor(instance, "click");
    }
  }

  get doubleClickableSelectable(): Selectable | undefined {
    const instance = this.selectables[0];
    if (instance) {
      return clickableAncestor(instance, "doubleClick");
    }
  }

  get selectable(): Selectable | undefined {
    if (this.mode === "doubleClick") {
      return this.doubleClickableSelectable;
    }

    return this.event.metaKey || this.event.ctrlKey
      ? this.deepestSelectable
      : this.clickableSelectable;
  }

  get deepestSelectable(): Selectable | undefined {
    return this.selectables[0];
  }
}
