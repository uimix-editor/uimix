import { Vec2 } from "paintvec";
import { DragHandler } from "./DragHandler";
import { NodeMoveDragHandler } from "./NodeMoveDragHandler";
import { dragStartThreshold } from "../constants";
import { ViewportEvent } from "./ViewportEvent";
import { Selectable } from "@uimix/model/src/models";
import { projectState } from "../../../state/ProjectState";

export class NodeClickMoveDragHandler implements DragHandler {
  static create(event: ViewportEvent): NodeClickMoveDragHandler | undefined {
    const selectable = event.selectable;
    if (selectable) {
      return new NodeClickMoveDragHandler(selectable, event);
    }
  }

  constructor(selectable: Selectable, event: ViewportEvent) {
    this.initClientPos = new Vec2(event.event.clientX, event.event.clientY);
    this.initPos = event.pos;
    this.selectable = selectable;
    this.additive = event.event.shiftKey;

    if (event.selectables.every((s) => !s.ancestorSelected)) {
      if (!this.additive) {
        projectState.project.clearSelection();
      }
      this.selectable.select();
    }
  }

  move(event: ViewportEvent): void {
    if (!this.moveHandler) {
      if (event.clientPos.sub(this.initClientPos).length < dragStartThreshold) {
        return;
      }

      this.moveHandler = new NodeMoveDragHandler(
        projectState.selectedSelectables,
        this.initPos
      );
    }

    this.moveHandler?.move(event);
  }

  end(event: ViewportEvent): void {
    this.moveHandler?.end(event);
    if (!this.moveHandler) {
      // do click
      if (!this.additive) {
        projectState.project.clearSelection();
      }
      this.selectable.select();
    }
    projectState.undoManager.stopCapturing();
  }

  private readonly initPos: Vec2;
  private readonly initClientPos: Vec2;
  private readonly selectable: Selectable;
  private readonly additive: boolean;
  private moveHandler: DragHandler | undefined;
}
