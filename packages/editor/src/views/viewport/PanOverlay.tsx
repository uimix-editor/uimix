import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { Vec2 } from "paintvec";
import React from "react";
import { usePointerStroke } from "../../components/hooks/usePointerStroke";
import { scrollState } from "../../state/ScrollState";
import { viewportState } from "../../state/ViewportState";

export const PanOverlay: React.FC = observer(function PanOverlay() {
  const pointerHandlers = usePointerStroke<HTMLElement, Vec2>({
    onBegin: action(() => {
      return scrollState.translation;
    }),

    onMove: action((_, { initData, totalDeltaX, totalDeltaY }) => {
      scrollState.setTranslation(
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
