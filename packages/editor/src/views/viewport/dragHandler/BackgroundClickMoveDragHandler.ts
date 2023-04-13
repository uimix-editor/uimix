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
    const rect = (viewportState.dragSelectionRect = Rect.boundingRect([
      this.startPos,
      event.pos,
    ]));

    // TODO
    // - optimize hit test
    // - don't select root frames and select next top level frames (like Figma)?

    const selectables = projectState.page?.selectable.offsetChildren ?? [];

    for (const selectable of selectables) {
      const bounds = selectable.computedRect;
      if (bounds && rect.intersection(bounds)) {
        selectable.select();
      }
    }
  }

  end(): void {
    viewportState.dragSelectionRect = undefined;
  }

  startPos: Vec2;
}
