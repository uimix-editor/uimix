import React from "react";
import { observer } from "mobx-react-lite";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { useEditorState } from "../../EditorStateContext";

export const DragIndicators: React.FC = observer(function DragIndicators() {
  const editorState = useEditorState();

  const dragPreviewRects = editorState.dragPreviewRects.map((rect) =>
    rect.transform(editorState.scroll.documentToViewport)
  );
  const dropTargetPreviewRect = editorState.dropTargetPreviewRect?.transform(
    editorState.scroll.documentToViewport
  );
  const dropIndexIndicator = editorState.dropIndexIndicator?.map((p) =>
    p.transform(editorState.scroll.documentToViewport)
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
        />
      )}
      {dropIndexIndicator && (
        <line
          x1={dropIndexIndicator[0].x}
          y1={dropIndexIndicator[0].y}
          x2={dropIndexIndicator[1].x}
          y2={dropIndexIndicator[1].y}
          strokeWidth={2}
          stroke={colors.active}
        />
      )}
    </>
  );
});
