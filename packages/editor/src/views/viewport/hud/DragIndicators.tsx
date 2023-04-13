import React from "react";
import { observer } from "mobx-react-lite";
import colors from "@uimix/foundation/src/colors.js";
import { viewportState } from "../../../state/ViewportState";
import { projectState } from "../../../state/ProjectState.js";
import { Color } from "@uimix/foundation/src/utils/Color";

export const DragIndicators: React.FC = observer(function DragIndicators() {
  const { documentToViewport } = projectState.scroll;

  const selectRect = viewportState.selectRect?.transform(
    projectState.scroll.documentToViewport
  );

  const dragPreviewRects = viewportState.dragPreviewRects.map((rect) =>
    rect.transform(documentToViewport)
  );
  const dropTargetPreviewRect =
    viewportState.dropDestination?.parent.computedRect.transform(
      documentToViewport
    );
  const dropIndexIndicator =
    viewportState.dropDestination?.insertionLine?.transform(documentToViewport);

  return (
    <>
      {selectRect && (
        <rect
          {...selectRect.toSVGRectProps()}
          fill={Color.from(colors.active)?.withAlpha(0.2).toString()}
          stroke={colors.active}
        />
      )}
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
