import React from "react";
import { observer } from "mobx-react-lite";
import { viewportState } from "../../../state/ViewportState";
import { projectState } from "../../../state/ProjectState.js";
import { Selectable } from "@uimix/model/src/models";

function variantCorrespondingsExcludingSelf(
  selectable: Selectable
): Selectable[] {
  return selectable.variantCorrespondings.filter((s) => s !== selectable);
}

export const CorrespondenceIndicator: React.FC = observer(
  function CorrespondenceIndicator() {
    const { documentToViewport } = projectState.scroll;

    const hoverRects = (
      viewportState.hoveredSelectable
        ? variantCorrespondingsExcludingSelf(
            viewportState.hoveredSelectable
          ).map((s) => s.computedRect)
        : []
    ).map((rect) => rect.transform(documentToViewport));

    // TODO: group by variant?
    const selectedRects = projectState.selectedSelectables
      .flatMap((s) =>
        variantCorrespondingsExcludingSelf(s).map((s) => s.computedRect)
      )
      .map((rect) => rect.transform(documentToViewport));

    return (
      <>
        {[...hoverRects, ...selectedRects].map((rect) => (
          <rect
            x={rect.left}
            y={rect.top}
            width={rect.width}
            height={rect.height}
            fill="none"
            strokeWidth={1}
            strokeDasharray={1}
            stroke="red"
          />
        ))}
      </>
    );
  }
);
