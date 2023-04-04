import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { Vec2 } from "paintvec";
import React from "react";
import { usePointerStroke } from "../../components/hooks/usePointerStroke";
import { viewportState } from "../../state/ViewportState";
import { projectState } from "../../state/ProjectState";

export const PanOverlay: React.FC = observer(function PanOverlay() {
  const pointerHandlers = usePointerStroke<HTMLElement, Vec2>({
    onBegin: action(() => {
      return projectState.scroll.translation;
    }),

    onMove: action((_, { initData, totalDeltaX, totalDeltaY }) => {
      projectState.scroll.setTranslation(
        initData.add(new Vec2(totalDeltaX, totalDeltaY))
      );
    }),
  });

  return (
    <div
      className="absolute left-0 top-0 w-full h-full cursor-grab"
      hidden={!viewportState.panMode}
      {...pointerHandlers}
    />
  );
});
