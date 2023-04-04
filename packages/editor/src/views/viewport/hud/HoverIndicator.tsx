import React from "react";
import { observer } from "mobx-react-lite";
import colors from "@uimix/foundation/src/colors.js";
import { viewportState } from "../../../state/ViewportState";
import { projectState } from "../../../state/ProjectState.js";

export const HoverIndicator: React.FC = observer(function HoverIndicator() {
  const rect = viewportState.hoveredSelectable?.computedRect?.transform(
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
