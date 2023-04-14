import React from "react";
import { observer } from "mobx-react-lite";
import colors from "@uimix/foundation/src/colors.js";
import { viewportState } from "../../../state/ViewportState";
import { projectState } from "../../../state/ProjectState.js";
import { Rect } from "paintvec";

export const CorrespondenceIndicator: React.FC = observer(
  function CorrespondenceIndicator() {
    const hoverRect =
      viewportState.hoveredSelectable?.originalVariantCorresponding.computedRect.transform(
        projectState.scroll.documentToViewport
      );
    const selectedRect = Rect.union(
      ...projectState.selectedSelectables.map(
        (s) => s.originalVariantCorresponding.computedRect
      )
    )?.transform(projectState.scroll.documentToViewport);

    return (
      <>
        {hoverRect && (
          <rect
            x={hoverRect.left}
            y={hoverRect.top}
            width={hoverRect.width}
            height={hoverRect.height}
            fill="none"
            strokeWidth={1}
            strokeDasharray={1}
            stroke={colors.active}
          />
        )}
        {selectedRect && (
          <rect
            x={selectedRect.left}
            y={selectedRect.top}
            width={selectedRect.width}
            height={selectedRect.height}
            fill="none"
            strokeWidth={1}
            strokeDasharray={1}
            stroke={colors.active}
          />
        )}
      </>
    );
  }
);
