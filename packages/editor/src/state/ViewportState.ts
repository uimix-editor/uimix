import { makeObservable, observable } from "mobx";
import { Rect } from "paintvec";
import { Selectable } from "../models/Selectable";
import { DropDestination } from "./DropDestination";
import { Tool } from "./Tool";

export class ViewportState {
  constructor() {
    makeObservable(this);
  }

  @observable hoveredSelectable: Selectable | undefined = undefined;
  @observable focusedSelectable: Selectable | undefined = undefined;
  @observable.ref dragPreviewRects: readonly Rect[] = [];
  @observable.ref dropDestination: DropDestination | undefined = undefined;

  @observable.ref tool: Tool | undefined = undefined;
  @observable panMode = false;
  @observable resizeBoxVisible = false;
  @observable measureMode = false;
}

export const viewportState = new ViewportState();
