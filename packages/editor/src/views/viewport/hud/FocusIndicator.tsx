import React from "react";
import { observer } from "mobx-react-lite";
import colors from "../../../colors.js";
import { viewportState } from "../../../state/ViewportState";
import { projectState } from "../../../state/ProjectState.js";

export const FocusIndicator: React.FC = observer(function HoverIndicator() {
  const rect = viewportState.focusedSelectable?.computedRect?.transform(
    projectState.scroll.documentToViewport
  );

  return rect ? (
    <rect
      x={rect.left}
      y={rect.top}
      width={rect.width}
      height={rect.height}
      fill="none"
      strokeWidth={1}
      stroke={colors.active}
    />
  ) : null;
});
