import { observer } from "mobx-react-lite";
import { projectState } from "../../../state/ProjectState";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { sameOrNone } from "@uimix/foundation/src/utils/Mixed";
import { IconButton, Tooltip } from "@uimix/foundation/src/components";
import { Clipboard } from "../../../state/Clipboard";
import { runInAction } from "mobx";
import { showImageInputDialog } from "../../../util/imageDialog";
import imageIcon from "@seanchas116/design-icons/json/image.json";

export const ImagePane: React.FC = observer(function ImagePane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => s.node.type === "image"
  );

  if (!selectables.length) {
    return null;
  }

  const imageHash = sameOrNone(selectables.map((s) => s.style.imageHash));

  const imageManager = projectState.project.imageManager;

  const image = imageHash != null ? imageManager.get(imageHash) : undefined;

  const copyImage = async () => {
    const dataURL = await image?.getDataURL();
    if (!dataURL) {
      return;
    }
    await Clipboard.handler.set("image", dataURL);
  };

  const pasteImage = async () => {
    const dataURL = await Clipboard.handler.get("image");
    if (!dataURL) {
      return;
    }
    const image = await imageManager.insertDataURL(dataURL);
    runInAction(() => {
      for (const selectable of selectables) {
        selectable.style.imageHash = image.filePath;
      }
      projectState.undoManager.stopCapturing();
    });
  };

  const uploadImage = async () => {
    const file = await showImageInputDialog();
    if (!file) {
      return;
    }
    const image = await imageManager.insert(file);
    runInAction(() => {
      for (const selectable of selectables) {
        selectable.style.imageHash = image.filePath;
      }
      projectState.undoManager.stopCapturing();
    });
  };

  const downloadImage = async () => {
    const image = imageHash && imageManager.get(imageHash);
    if (!image) {
      return;
    }

    const a = document.createElement("a");
    a.href = await image.getDataURL();
    a.download = "image.png";
    a.click();
  };

  return (
    <InspectorPane>
      <InspectorHeading icon={imageIcon} text="Image" />
      <InspectorTargetContext.Provider value={selectables}>
        <img
          src={image?.url ?? undefined}
          className="w-full aspect-video object-contain border border-macaron-separator bg-macaron-uiBackground rounded-lg overflow-hidden p-2
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
          <Tooltip text="Select Image File...">
            <IconButton icon="material-symbols:upload" onClick={uploadImage} />
          </Tooltip>
          <Tooltip text="Save Image...">
            <IconButton
              icon="material-symbols:download"
              onClick={downloadImage}
            />
          </Tooltip>
        </div>
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});
