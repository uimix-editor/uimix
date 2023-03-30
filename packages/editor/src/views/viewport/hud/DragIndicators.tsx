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
  const dropIndexIndicator =
    viewportState.dropDestination?.insertionLine?.transform(
      scrollState.documentToViewport
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
