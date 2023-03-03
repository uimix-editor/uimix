import React from "react";
import { observer } from "mobx-react-lite";
import colors from "../../../colors.js";
import { scrollState } from "../../../state/ScrollState";
import { viewportState } from "../../../state/ViewportState";

export const HoverIndicator: React.FC = observer(function HoverIndicator() {
  const rect = viewportState.hoveredSelectable?.computedRect?.transform(
    scrollState.documentToViewport
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
