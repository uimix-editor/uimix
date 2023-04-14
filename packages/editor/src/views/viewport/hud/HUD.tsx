import { DragIndicators } from "./DragIndicators";
import { FocusIndicator } from "./FocusIndicator";
import { HoverIndicator } from "./HoverIndicator";
import { DistanceMeasure } from "./DistanceMeasure";
import { NodeResizeBox } from "./NodeResizeBox";
import { SnapIndicators } from "./SnapIndicators";
import { SelectionInfo } from "./SelectionInfo";
import { MarginPaddingIndicator } from "./MarginPaddingIndicator";
import { CorrespondenceIndicator } from "./CorrespondenceIndicator";

export function HUD() {
  return (
    <>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <MarginPaddingIndicator />
        <CorrespondenceIndicator />
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
