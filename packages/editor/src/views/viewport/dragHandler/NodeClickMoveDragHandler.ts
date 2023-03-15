import { Vec2 } from "paintvec";
import { DragHandler } from "./DragHandler";
import { NodeInFlowMoveDragHandler } from "./NodeInFlowMoveDragHandler";
import { NodeAbsoluteMoveDragHandler } from "./NodeAbsoluteMoveDragHandler";
import { dragStartThreshold } from "../constants";
import { NodePickResult } from "../renderer/NodePicker";
import { Selectable } from "../../../models/Selectable";
import { projectState } from "../../../state/ProjectState";

export class NodeClickMoveDragHandler implements DragHandler {
  static create(
    pickResult: NodePickResult
  ): NodeClickMoveDragHandler | undefined {
    const override = pickResult.default;
    if (override) {
      return new NodeClickMoveDragHandler(override, pickResult);
    }
  }

  constructor(override: Selectable, pickResult: NodePickResult) {
    this.initClientPos = new Vec2(
      pickResult.event.clientX,
      pickResult.event.clientY
    );
    this.initPos = pickResult.pos;
    this.override = override;
    this.additive = pickResult.event.shiftKey;

    if (pickResult.all.every((o) => !o.ancestorSelected)) {
      if (!this.additive) {
        projectState.page?.selectable.deselect();
      }
      this.override.select();
    }
  }

  move(pickResult: NodePickResult): void {
    if (!this.handler) {
      if (
        pickResult.clientPos.sub(this.initClientPos).length < dragStartThreshold
      ) {
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

    this.handler?.move(pickResult);
  }

  end(pickResult: NodePickResult): void {
    this.handler?.end(pickResult);
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
