import React from "react";
import { observer } from "mobx-react-lite";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { useEditorState } from "../../EditorStateContext";

export const HoverIndicator: React.FC = observer(function HoverIndicator() {
  const editorState = useEditorState();

  const hoverRect = editorState.hoveredRect?.transform(
    editorState.scroll.documentToViewport
  );

  return hoverRect ? (
    <rect
      x={hoverRect.left}
      y={hoverRect.top}
      width={hoverRect.width}
      height={hoverRect.height}
      fill="none"
      strokeWidth={2}
      stroke={colors.active}
    />
  ) : null;
});
