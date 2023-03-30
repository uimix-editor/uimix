import React from "react";
import { observer } from "mobx-react-lite";
import colors from "../../../colors.js";
import { scrollState } from "../../../state/ScrollState";
import { viewportState } from "../../../state/ViewportState";

export const DragIndicators: React.FC = observer(function DragIndicators() {
  const dragPreviewRects = viewportState.dragPreviewRects.map((rect) =>
    rect.transform(scrollState.documentToViewport)
  );
  const dropTargetPreviewRect =
    viewportState.dropDestination?.parent.computedRect.transform(
      scrollState.documentToViewport
    );
  const dropIndexIndicator = viewportState.dropDestination?.insertionLine?.map(
    (p) => p.transform(scrollState.documentToViewport)
  );

  return (
    <>
      {dragPreviewRects.map((rect, i) => (
        <rect
          key={i}
          x={rect.left}
          y={rect.top}
          width={rect.width}
          height={rect.height}
          fill="none"
          strokeDasharray="2 2"
          stroke={colors.active}
        />
      ))}
      {dropTargetPreviewRect && (
        <rect
          x={dropTargetPreviewRect.left}
          y={dropTargetPreviewRect.top}
          width={dropTargetPreviewRect.width}
          height={dropTargetPreviewRect.height}
          fill="none"
          strokeDasharray="2 2"
          stroke={colors.active}
          strokeWidth={2}
        />
      )}
      {dropIndexIndicator && (
        <line
          x1={dropIndexIndicator[0].x}
          y1={dropIndexIndicator[0].y}
          x2={dropIndexIndicator[1].x}
          y2={dropIndexIndicator[1].y}
          stroke={colors.active}
          strokeWidth={2}
        />
      )}
    </>
  );
});
