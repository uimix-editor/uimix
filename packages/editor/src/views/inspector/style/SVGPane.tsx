import { observer } from "mobx-react-lite";
import { projectState } from "../../../state/ProjectState";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { sameOrNone } from "@uimix/foundation/src/utils/Mixed";
import { IconButton } from "@uimix/foundation/src/components/IconButton";
import { Tooltip } from "@uimix/foundation/src/components/Tooltip";
import { Clipboard } from "../../../state/Clipboard";
import { action, runInAction } from "mobx";
import { showImageInputDialog } from "../../../util/imageDialog";
import { Buffer } from "buffer";

export const SVGPane: React.FC = observer(function SVGPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => s.node.type === "svg"
  );

  if (!selectables.length) {
    return null;
  }

  const svgContent = sameOrNone(selectables.map((s) => s.style.svgContent));
  const svgDataURL =
    svgContent &&
    `data:image/svg+xml;base64,${Buffer.from(svgContent).toString("base64")}`;

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:format-paint-outline-rounded"
        text="SVG"
      />
      <InspectorTargetContext.Provider value={selectables}>
        <img
          src={svgDataURL}
          className="w-full aspect-video object-contain border border-macaron-separator bg-macaron-uiBackground rounded-lg overflow-hidden p-2"
        />
        <textarea
          className="border border-macaron-separator outline-0 w-full h-24 px-1.5 py-1 bg-macaron-uiBackground focus:ring-1 ring-inset ring-macaron-active text-macaron-text text-macaron-base placeholder:text-macaron-disabledText rounded-lg"
          value={svgContent}
          onChange={action((e) => {
            const svgContent = e.target.value;
            for (const selectable of selectables) {
              selectable.style.svgContent = svgContent;
            }
            projectState.undoManager.stopCapturing();
          })}
        />
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});
