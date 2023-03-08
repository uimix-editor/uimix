import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { viewportState } from "../../state/ViewportState";
import { InsertPalette } from "../outline/InsertPalette";

export const InspectorPaletteOverlay: React.FC = observer(() => {
  if (!viewportState.showsInstancePalette) {
    return null;
  }

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        onClick={action(() => {
          viewportState.showsInstancePalette = false;
        })}
      />
      <InsertPalette />
    </div>
  );
});
