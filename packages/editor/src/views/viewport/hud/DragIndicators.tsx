import React from "react";
import { observer } from "mobx-react-lite";
import colors from "../../../colors.js";
import { viewportState } from "../../../state/ViewportState";
import { projectState } from "../../../state/ProjectState.js";

export const DragIndicators: React.FC = observer(function DragIndicators() {
  const dragPreviewRects = viewportState.dragPreviewRects.map((rect) =>
    rect.transform(projectState.scroll.documentToViewport)
  );
  const dropTargetPreviewRect =
    viewportState.dropDestination?.parent.computedRect.transform(
      projectState.scroll.documentToViewport
    );
  const dropIndexIndicator =
    viewportState.dropDestination?.insertionLine?.transform(
      projectState.scroll.documentToViewport
    );

  return (
    <>
      {dragPreviewRects.map((rect, i) => (
        <rect
          key={i}
          {...rect.toSVGRectProps()}
          fill="none"
          strokeDasharray="2 2"
          stroke={colors.active}
        />
      ))}
      {dropTargetPreviewRect && (
        <rect
          {...dropTargetPreviewRect.toSVGRectProps()}
          fill="none"
          strokeDasharray="2 2"
          stroke={colors.active}
          strokeWidth={2}
        />
      )}
      {dropIndexIndicator && (
        <line
          {...dropIndexIndicator.toSVGLineProps()}
          stroke={colors.active}
          strokeWidth={2}
        />
      )}
    </>
  );
});
