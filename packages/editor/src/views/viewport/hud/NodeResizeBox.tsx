import { action, computed, makeObservable } from "mobx";
import React from "react";
import { Vec2, Rect, Transform } from "paintvec";
import { observer } from "mobx-react-lite";
import { Selectable } from "@uimix/model/src/models";
import { projectState } from "../../../state/ProjectState";
import colors from "@uimix/foundation/src/colors";
import { ResizeBox } from "@uimix/foundation/src/components";
import { roundRectXYWH } from "../../../types/Rect";
import { snapper } from "../../../state/Snapper";
import { assertNonNull } from "@uimix/foundation/src/utils/Assert";
import { viewportState } from "../../../state/ViewportState";
import { resizeWithBoundingBox } from "@uimix/model/src/services";

class NodeResizeBoxState {
  constructor() {
    makeObservable(this);
  }

  private initWholeBoundingBox = new Rect();
  private initBoundingBoxes = new Map<Selectable, Rect>();
  private widthChanged = false;
  private heightChanged = false;

  get selectedInstances(): Selectable[] {
    return projectState.selectedSelectables.filter(
      (s) => s.originalNode.type !== "component"
    );
  }

  @computed get stroke(): string {
    return colors.blue;
  }

  @computed get boundingBox(): Rect | undefined {
    return Rect.union(
      ...this.selectedInstances
        .filter((s) => !s.originalNode.isAbstract)
        .map((i) => i.computedRect)
    );
  }

  @computed get viewportBoundingBox(): Rect | undefined {
    return this.boundingBox?.transform(projectState.scroll.documentToViewport);
  }

  begin() {
    for (const instance of this.selectedInstances) {
      this.initBoundingBoxes.set(instance, instance.computedRect);
    }
    this.initWholeBoundingBox = this.boundingBox ?? new Rect();
    this.widthChanged = false;
    this.heightChanged = false;
  }

  change(p0: Vec2, p1: Vec2) {
    const newWholeBBox = assertNonNull(Rect.boundingRect([p0, p1])).transform(
      projectState.scroll.viewportToDocument
    );
    if (
      Math.round(newWholeBBox.width) !==
      Math.round(this.initWholeBoundingBox.width)
    ) {
      this.widthChanged = true;
    }
    if (
      Math.round(newWholeBBox.height) !==
      Math.round(this.initWholeBoundingBox.height)
    ) {
      this.heightChanged = true;
    }
    const transform = Transform.rectToRect(
      this.initWholeBoundingBox,
      newWholeBBox
    );

    for (const [instance, originalBBox] of this.initBoundingBoxes) {
      const newBBox = roundRectXYWH(originalBBox.transform(transform));

      resizeWithBoundingBox(instance, newBBox, {
        x: true,
        y: true,
        width: this.widthChanged,
        height: this.heightChanged,
      });
    }
  }

  end() {
    this.initBoundingBoxes.clear();

    if (!this.widthChanged && !this.heightChanged) {
      return;
    }

    projectState.undoManager.stopCapturing();
  }
}

const state = new NodeResizeBoxState();

export const NodeResizeBox: React.FC = observer(function NodeResizeBox() {
  if (viewportState.dragPreviewRects.length) {
    return null;
  }
  if (viewportState.focusedSelectable) {
    return null;
  }

  const boundingBox = state.viewportBoundingBox;
  if (!boundingBox) {
    return null;
  }

  return (
    <ResizeBox
      p0={boundingBox.topLeft}
      p1={boundingBox.bottomRight}
      snap={action((p: Vec2) => {
        // TODO: avoid transform
        const { viewportToDocument, documentToViewport } = projectState.scroll;
        let pos = p.transform(viewportToDocument).round;
        pos = snapper.snapResizePoint(state.selectedInstances, pos);
        return pos.transform(documentToViewport);
      })}
      onChangeBegin={action(state.begin.bind(state))}
      onChange={action(state.change.bind(state))}
      onChangeEnd={action(state.end.bind(state))}
      stroke={state.stroke}
    />
  );
});
