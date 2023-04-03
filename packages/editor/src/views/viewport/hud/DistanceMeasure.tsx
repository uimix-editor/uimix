import { observer } from "mobx-react-lite";
import { Rect } from "paintvec";
import React from "react";
import colors from "../../../colors";
import { projectState } from "../../../state/ProjectState";
import { viewportState } from "../../../state/ViewportState";
import { XDistanceIndicator, YDistanceIndicator } from "./DistanceIndicator";

export const DistanceMeasure: React.FC = observer(function DistanceMeasure() {
  if (!viewportState.measureMode) {
    return null;
  }

  const transform = projectState.scroll.documentToViewport;

  const hoverRect = viewportState.hoveredSelectable?.computedRect;
  const selectedRect = Rect.union(
    ...projectState.selectedSelectables.map((o) => o.computedRect)
  );
  if (!hoverRect || !selectedRect) {
    return null;
  }

  const intersection = hoverRect.intersection(selectedRect);
  const union = hoverRect.union(selectedRect);

  if (intersection) {
    const offset = union.insetsTo(intersection);

    return (
      <>
        {offset.left > 0 && (
          <XDistanceIndicator
            y={intersection.center.y}
            x1={intersection.left}
            x2={union.left}
            transform={transform}
            color={colors.red}
          />
        )}
        {offset.right > 0 && (
          <XDistanceIndicator
            y={intersection.center.y}
            x1={intersection.right}
            x2={union.right}
            transform={transform}
            color={colors.red}
          />
        )}
        {offset.top > 0 && (
          <YDistanceIndicator
            x={intersection.center.x}
            y1={intersection.top}
            y2={union.top}
            transform={transform}
            color={colors.red}
          />
        )}
        {offset.bottom > 0 && (
          <YDistanceIndicator
            x={intersection.center.x}
            y1={intersection.bottom}
            y2={union.bottom}
            transform={transform}
            color={colors.red}
          />
        )}
      </>
    );
  } else {
    let xIndicator: JSX.Element | undefined;
    let yIndicator: JSX.Element | undefined;

    const y =
      (Math.min(
        Math.max(selectedRect.top, hoverRect.top),
        selectedRect.bottom
      ) +
        Math.max(
          Math.min(selectedRect.bottom, hoverRect.bottom),
          selectedRect.top
        )) *
      0.5;
    if (selectedRect.right < hoverRect.left) {
      xIndicator = (
        <XDistanceIndicator
          y={y}
          x1={selectedRect.right}
          x2={hoverRect.left}
          transform={transform}
          color={colors.red}
        />
      );
    }
    if (hoverRect.right < selectedRect.left) {
      xIndicator = (
        <XDistanceIndicator
          y={y}
          x1={hoverRect.right}
          x2={selectedRect.left}
          transform={transform}
          color={colors.red}
        />
      );
    }

    const x =
      (Math.min(
        Math.max(selectedRect.left, hoverRect.left),
        selectedRect.right
      ) +
        Math.max(
          Math.min(selectedRect.right, hoverRect.right),
          selectedRect.left
        )) *
      0.5;
    if (selectedRect.bottom < hoverRect.top) {
      yIndicator = (
        <YDistanceIndicator
          x={x}
          y1={selectedRect.bottom}
          y2={hoverRect.top}
          transform={transform}
          color={colors.red}
        />
      );
    }
    if (hoverRect.bottom < selectedRect.top) {
      yIndicator = (
        <YDistanceIndicator
          x={x}
          y1={hoverRect.bottom}
          y2={selectedRect.top}
          transform={transform}
          color={colors.red}
        />
      );
    }

    return (
      <>
        {xIndicator}
        {yIndicator}
      </>
    );
  }
});
