import { DragIndicators } from "./DragIndicators";
import { FocusIndicator } from "./FocusIndicator";
import { HoverIndicator } from "./HoverIndicator";
import { DistanceMeasure } from "./DistanceMeasure";
import { NodeResizeBox } from "./NodeResizeBox";
import { SnapIndicators } from "./SnapIndicators";
import { SelectionInfo } from "./SelectionInfo";

export function HUD() {
  return (
    <>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <HoverIndicator />
        <FocusIndicator />
        <DragIndicators />
        <NodeResizeBox />
        <SnapIndicators />
        <DistanceMeasure />
      </svg>
      <SelectionInfo />
    </>
  );
}
