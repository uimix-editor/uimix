import { Vec2 } from "paintvec";
import { DragHandler } from "./DragHandler";
import { NodeMoveDragHandler } from "./NodeMoveDragHandler";
import { dragStartThreshold } from "../constants";
import { ViewportEvent } from "./ViewportEvent";
import { Selectable } from "../../../models/Selectable";
import { projectState } from "../../../state/ProjectState";

export class NodeClickMoveDragHandler implements DragHandler {
  static create(event: ViewportEvent): NodeClickMoveDragHandler | undefined {
    const override = event.selectable;
    if (override) {
      return new NodeClickMoveDragHandler(override, event);
    }
  }

  constructor(override: Selectable, event: ViewportEvent) {
    this.initClientPos = new Vec2(event.event.clientX, event.event.clientY);
    this.initPos = event.pos;
    this.override = override;
    this.additive = event.event.shiftKey;

    if (event.selectables.every((o) => !o.ancestorSelected)) {
      if (!this.additive) {
        projectState.page?.selectable.deselect();
      }
      this.override.select();
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
        projectState.page?.selectable.deselect();
      }
      this.override.select();
    }
    projectState.undoManager.stopCapturing();
  }

  private readonly initPos: Vec2;
  private readonly initClientPos: Vec2;
  private readonly override: Selectable;
  private readonly additive: boolean;
  private moveHandler: DragHandler | undefined;
}
