import { createAtom } from "mobx";
import { Rect, Vec2 } from "paintvec";
import { IComputedRectProvider } from "../../../models/Selectable";
import { scrollState } from "../../../state/ScrollState";

export const viewportRootMarker = "data-viewport-root";

function getComputedRect(element: Element): Rect {
  const offsetParent = (element as HTMLElement).offsetParent;
  if (!offsetParent) {
    return new Rect();
  }

  const width =
    (element as HTMLElement).getBoundingClientRect().width / scrollState.scale;
  const height =
    (element as HTMLElement).getBoundingClientRect().height / scrollState.scale;

  const localRect = Rect.from({
    left: (element as HTMLElement).offsetLeft,
    top: (element as HTMLElement).offsetTop,
    width,
    height,
  });

  if (offsetParent.hasAttribute(viewportRootMarker)) {
    return localRect;
  }

  const parentRect = getComputedRect(offsetParent);
  const parentBorderLeft = parseInt(
    window.getComputedStyle(offsetParent).borderLeftWidth
  );
  const parentBorderTop = parseInt(
    window.getComputedStyle(offsetParent).borderTopWidth
  );

  return localRect.translate(
    new Vec2(
      parentRect.left + parentBorderLeft,
      parentRect.top + parentBorderTop
    )
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
