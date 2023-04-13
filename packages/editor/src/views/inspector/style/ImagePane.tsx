import { observer } from "mobx-react-lite";
import { projectState } from "../../../state/ProjectState";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { sameOrNone } from "@uimix/foundation/src/utils/Mixed";
import { IconButton } from "@uimix/foundation/src/components/IconButton";
import { Tooltip } from "@uimix/foundation/src/components/Tooltip";
import { Clipboard } from "../../../state/Clipboard";

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

  const copyImage = async () => {
    const imageWithDataURL =
      imageHash &&
      (await projectState.project.imageManager.getWithDataURL(imageHash));
    if (imageWithDataURL) {
      await Clipboard.handler.set("image", imageWithDataURL.url);
    }
  };

  const pasteImage = () => {
    throw new Error("Not implemented");
  };

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:format-paint-outline-rounded"
        text="Image"
      />
      <InspectorTargetContext.Provider value={selectables}>
        <img
          src={src ?? undefined}
          className="w-full aspect-square object-contain border border-macaron-separator bg-macaron-uiBackground rounded-lg overflow-hidden p-2
        "
        />
        <div className="flex gap-2">
          <Tooltip text="Copy Image">
            <IconButton
              icon="material-symbols:content-copy-outline"
              onClick={copyImage}
            />
          </Tooltip>
          <Tooltip text="Paste Image">
            <IconButton
              icon="material-symbols:content-paste"
              onClick={pasteImage}
            />
          </Tooltip>
        </div>
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});
