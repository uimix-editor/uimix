import { observer } from "mobx-react-lite";
import { projectState } from "../../../state/ProjectState";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { sameOrNone } from "@uimix/foundation/src/utils/Mixed";
import { IconButton } from "@uimix/foundation/src/components/IconButton";
import { Tooltip } from "@uimix/foundation/src/components/Tooltip";

export const ImagePane: React.FC = observer(function FillPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => s.node.type === "image"
  );

  if (!selectables.length) {
    return null;
  }

  const imageHash = sameOrNone(selectables.map((s) => s.style.imageHash));

  const src =
    imageHash && projectState.project.imageManager.get(imageHash)?.url;

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:format-paint-outline-rounded"
        text="Image"
      />
      <InspectorTargetContext.Provider value={selectables}>
        <img
          src={src ?? undefined}
          className="w-full aspect-square object-contain border border-macaron-separator bg-macaron-uiBackground rounded-lg overflow-hidden
        "
        />
        <div className="flex gap-2">
          <Tooltip text="Copy Image">
            <IconButton icon="material-symbols:content-copy-outline" />
          </Tooltip>
          <Tooltip text="Paste Image">
            <IconButton icon="material-symbols:content-paste" />
          </Tooltip>
        </div>
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});
