import { createAtom } from "mobx";
import { Rect } from "paintvec";
import { IComputedRectProvider } from "@uimix/model/src/models";
import { projectState } from "../../../state/ProjectState";

export const viewportRootMarker = "data-viewport-root";

function getComputedRect(element: Element): Rect {
  // TODO: avoid floating point errors when zoom scale is not a round number
  return Rect.from((element as HTMLElement).getBoundingClientRect()).transform(
    projectState.scroll.viewportToDocument
  );
}

export class ComputedRectProvider implements IComputedRectProvider {
  constructor(element: Element) {
    this.element = element;
    this._value = getComputedRect(element);
  }

  readonly element: Element;
  private _value = Rect.from({ x: 0, y: 0, width: 0, height: 0 });
  private _dirty = false;
  private readonly atom = createAtom("ObservableComputedRect");

  get value(): Rect {
    this.atom.reportObserved();
    if (this._dirty) {
      this._value = getComputedRect(this.element);
      this._dirty = false;
    }
    return this._value;
  }

  get dirty(): boolean {
    return this._dirty;
  }

  markDirty(): void {
    this._dirty = true;
    this.atom.reportChanged();
  }
}
