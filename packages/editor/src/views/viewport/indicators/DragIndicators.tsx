import React from "react";
import { observer } from "mobx-react-lite";
import { Vec2 } from "paintvec";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { useEditorState } from "../../useEditorState";
import { DropDestination } from "../../../state/DropDestination";

function dropDestinationIndicator(
  dst: DropDestination
): [Vec2, Vec2] | undefined {
  const { parent, ref } = dst;

  const direction = parent.layoutDirection;
  const inFlowChildren = parent.inFlowChildren;

  let index = inFlowChildren.findIndex((o) => o === ref);
  if (index < 0) {
    index = inFlowChildren.length;
  }

  const parentRect = parent.boundingBox;
  const parentPaddings = parent.computedPaddings;

  if (direction === "x") {
    let x: number;

    if (index === 0) {
      x = parentRect.left + parentPaddings.left;
    } else if (index === inFlowChildren.length) {
      const prev = inFlowChildren[index - 1];
      x = prev.boundingBox.right;
    } else {
      const prev = inFlowChildren[index - 1];
      const next = inFlowChildren[index];
      x = (prev.boundingBox.right + next.boundingBox.left) / 2;
    }

    const y1 = parentRect.top + parentPaddings.top;
    const y2 = parentRect.bottom - parentPaddings.bottom;

    return [new Vec2(x, y1), new Vec2(x, y2)];
  } else {
    let y: number;

    if (index === 0) {
      y = parentRect.top + parentPaddings.top;
    } else if (index === inFlowChildren.length) {
      const prev = inFlowChildren[index - 1];
      y = prev.boundingBox.bottom;
    } else {
      const prev = inFlowChildren[index - 1];
      const next = inFlowChildren[index];
      y = (prev.boundingBox.bottom + next.boundingBox.top) / 2;
    }

    const x1 = parentRect.left + parentPaddings.left;
    const x2 = parentRect.right - parentPaddings.right;

    return [new Vec2(x1, y), new Vec2(x2, y)];
  }
}

export const DragIndicators: React.FC = observer(function DragIndicators() {
  const editorState = useEditorState();

  const dragPreviewRects = editorState.dragPreviewRects.map((rect) =>
    rect.transform(editorState.scroll.documentToViewport)
  );
  const dropTargetPreviewRect =
    editorState.dropDestination?.parent.boundingBox.transform(
      editorState.scroll.documentToViewport
    );
  const dropIndexIndicator = (
    editorState.dropDestination &&
    dropDestinationIndicator(editorState.dropDestination)
  )?.map((p) => p.transform(editorState.scroll.documentToViewport));

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
