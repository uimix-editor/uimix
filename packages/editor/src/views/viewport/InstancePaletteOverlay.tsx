import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { viewportState } from "../../state/ViewportState";
import { InstancePalette } from "../outline/InstancePalette";

export const InstancePaletteOverlay: React.FC = observer(() => {
  if (viewportState.tool?.type !== "instancePalette") {
    return null;
  }

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        onClick={action(() => {
          viewportState.tool = undefined;
        })}
      />
      <InstancePalette />
    </div>
  );
});
