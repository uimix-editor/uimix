import React from "react";
import { observer } from "mobx-react-lite";
import { viewportState } from "../../../state/ViewportState";
import { projectState } from "../../../state/ProjectState.js";
import { Selectable } from "@uimix/model/src/models";
import colors from "@uimix/foundation/src/colors.js";

export const CorrespondenceIndicator: React.FC = observer(
  function CorrespondenceIndicator() {
    const { documentToViewport } = projectState.scroll;

    const targets = new Set<Selectable>();
    if (viewportState.hoveredSelectable) {
      targets.add(viewportState.hoveredSelectable);
    }
    for (const selected of projectState.selectedSelectables) {
      targets.add(selected);
    }

    const correspondings = new Set(
      [...targets].flatMap((s) => s.variantCorrespondings)
    );
    for (const target of targets) {
      correspondings.delete(target);
    }

    // TODO: group by variant and union?
    const rects = [...correspondings].map((s) =>
      s.computedRect.transform(documentToViewport)
    );

    return (
      <>
        {rects.map((rect) => (
          <rect
            x={rect.left}
            y={rect.top}
            width={rect.width}
            height={rect.height}
            fill="none"
            strokeWidth={1}
            strokeDasharray="1"
            stroke={colors.active}
          />
        ))}
      </>
    );
  }
);
