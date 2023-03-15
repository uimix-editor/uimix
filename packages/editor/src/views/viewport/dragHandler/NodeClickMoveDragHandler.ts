import { Vec2 } from "paintvec";
import { DragHandler } from "./DragHandler";
import { NodeInFlowMoveDragHandler } from "./NodeInFlowMoveDragHandler";
import { NodeAbsoluteMoveDragHandler } from "./NodeAbsoluteMoveDragHandler";
import { dragStartThreshold } from "../constants";
import { ViewportEvent } from "../renderer/NodePicker";
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
    if (!this.handler) {
      if (event.clientPos.sub(this.initClientPos).length < dragStartThreshold) {
        return;
      }

      const absoluteTargets: Selectable[] = [];
      const inFlowTargets: Selectable[] = [];
      for (const override of projectState.selectedSelectables) {
        if (override.inFlow) {
          inFlowTargets.push(override);
        } else {
          absoluteTargets.push(override);
        }
      }

      if (absoluteTargets.length) {
        this.handler = new NodeAbsoluteMoveDragHandler(
          absoluteTargets,
          this.initPos
        );
      } else if (inFlowTargets.length) {
        this.handler = new NodeInFlowMoveDragHandler(
          inFlowTargets,
          this.initPos
        );
      }
    }

    this.handler?.move(event);
  }

  end(event: ViewportEvent): void {
    this.handler?.end(event);
    if (!this.handler) {
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
  private handler: DragHandler | undefined;
}
