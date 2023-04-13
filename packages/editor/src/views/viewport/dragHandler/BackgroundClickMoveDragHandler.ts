import { Rect, Vec2 } from "paintvec";
import { projectState } from "../../../state/ProjectState";
import { viewportState } from "../../../state/ViewportState";
import { DragHandler } from "./DragHandler";
import { ViewportEvent } from "./ViewportEvent";

export class BackgroundClickMoveDragHandler implements DragHandler {
  constructor(event: ViewportEvent) {
    projectState.project.clearSelection();
    this.startPos = event.pos;
  }

  move(event: ViewportEvent): void {
    viewportState.dragSelectionRect = Rect.boundingRect([
      this.startPos,
      event.pos,
    ]);
  }

  end(): void {
    viewportState.dragSelectionRect = undefined;
  }

  startPos: Vec2;
}
