import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { useEditorState } from "../../EditorStateContext";
import { ElementResizeBox } from "./ElementResizeBox";
import { SnapIndicators } from "./SnapIndicators";

const IndicatorsWrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const IndicatorsSVG = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

export const Indicators: React.VFC<{
  className?: string;
}> = observer(function Indicators({ className }) {
  const editorState = useEditorState();

  const hoverRect = editorState.hoveredRect?.transform(
    editorState.scroll.documentToViewport
  );

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
    <IndicatorsWrap className={className}>
      <IndicatorsSVG>
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
        {hoverRect && (
          <rect
            x={hoverRect.left}
            y={hoverRect.top}
            width={hoverRect.width}
            height={hoverRect.height}
            fill="none"
            strokeWidth={2}
            stroke={colors.active}
          />
        )}
        <ElementResizeBox />
        <SnapIndicators />
      </IndicatorsSVG>
    </IndicatorsWrap>
  );
});
