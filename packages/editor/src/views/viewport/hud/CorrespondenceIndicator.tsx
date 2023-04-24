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
      [...targets].flatMap((s) =>
        s.variantCorrespondings.map(({ selectable }) => selectable)
      )
    );
    for (const target of targets) {
      correspondings.delete(target);
    }

    console.log(correspondings);
    console.log([...correspondings].map((c) => c.computedRect));

    // TODO: group by variant and union?

    return (
      <>
        {[...correspondings].map((s) => {
          const rect = s.computedRect.transform(documentToViewport);

          return (
            <rect
              id={s.id}
              x={rect.left}
              y={rect.top}
              width={rect.width}
              height={rect.height}
              fill="none"
              strokeWidth={1}
              strokeDasharray="1"
              stroke={colors.blue}
            />
          );
        })}
      </>
    );
  }
);
