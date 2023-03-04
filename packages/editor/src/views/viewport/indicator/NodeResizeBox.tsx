import { action, computed, makeObservable } from "mobx";
import React from "react";
import { Vec2, Rect, Transform } from "paintvec";
import { observer } from "mobx-react-lite";
import { Selectable } from "../../../models/Selectable";
import { projectState } from "../../../state/ProjectState";
import colors from "../../../colors.js";
import { scrollState } from "../../../state/ScrollState";
import { ResizeBox } from "../../../components/ResizeBox";
import { roundRectXYWH } from "../../../types/Rect";
import { snapper } from "../../../state/Snapper";
import { assertNonNull } from "../../../utils/Assert";
import { viewportState } from "../../../state/ViewportState";
import { resizeWithBoundingBox } from "../../../services/Resize";

class NodeResizeBoxState {
  constructor() {
    makeObservable(this);
  }

  private initWholeBoundingBox = new Rect();
  private initBoundingBoxes = new Map<Selectable, Rect>();
  private widthChanged = false;
  private heightChanged = false;

  get selectedInstances(): Selectable[] {
    return projectState.selectedSelectables;
  }

  @computed get stroke(): string {
    return colors.active;
  }

  @computed get boundingBox(): Rect | undefined {
    return Rect.union(
      ...this.selectedInstances
        .filter((s) => !s.originalNode.isAbstract)
        .map((i) => i.computedRect)
    );
  }

  @computed get viewportBoundingBox(): Rect | undefined {
    return this.boundingBox?.transform(scrollState.documentToViewport);
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
      scrollState.viewportToDocument
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
        let pos = p.transform(scrollState.viewportToDocument).round;
        pos = snapper.snapResizePoint(pos);
        return pos.transform(scrollState.documentToViewport);
      })}
      onChangeBegin={action(state.begin.bind(state))}
      onChange={action(state.change.bind(state))}
      onChangeEnd={action(state.end.bind(state))}
      stroke={state.stroke}
    />
  );
});
