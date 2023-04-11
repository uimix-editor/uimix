import { observer } from "mobx-react-lite";
import React from "react";
import { IFrame } from "../../components/IFrame";
import { ForeignComponentManager } from "../../../state/ForeignComponentManager";
import { Selectable } from "@uimix/model/src/models";
import { projectState } from "../../../state/ProjectState";
import { viewportRootMarker } from "./ComputedRectProvider";
import { FontLoader } from "./FontLoader";
import { nodePicker } from "./NodePicker";
import { NodeRenderer } from "./NodeRenderer";

const RenderIFrameBody: React.FC = observer(() => {
  return (
    <div
      style={{
        position: "absolute",
        transformOrigin: "left top",
        transform: projectState.scroll.documentToViewport.toCSSMatrixString(),
      }}
      {...{
        [viewportRootMarker]: true,
      }}
    >
      {projectState.page?.selectable.children.map((child) => (
        <NodeRenderer
          key={child.id}
          selectable={child}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          foreignComponentManager={ForeignComponentManager.global!}
        />
      ))}
    </div>
  );
});
RenderIFrameBody.displayName = "RenderIFrameBody";

export const RenderIFrame: React.FC = () => {
  return (
    <IFrame
      className="absolute inset-0 w-full h-full contain-strict"
      init={(window) => {
        ForeignComponentManager.init(window);

        nodePicker.document = window.document;

        const onFontsLoaded = () => {
          console.log("fonts loaded");

          const markDirtyRecursive = (selectable: Selectable) => {
            selectable.computedRectProvider?.markDirty();
            for (const child of selectable.children) {
              markDirtyRecursive(child);
            }
          };
          projectState.page?.selectable.children.forEach(markDirtyRecursive);
        };
        window.document.fonts.addEventListener("loadingdone", onFontsLoaded);

        return (
          <>
            <FontLoader />
            <RenderIFrameBody />
          </>
        );
      }}
    />
  );
};

RenderIFrame.displayName = "RenderIFrame";
