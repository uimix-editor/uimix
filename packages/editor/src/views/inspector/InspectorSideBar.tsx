import { observer } from "mobx-react-lite";
import { StyleInspector } from "./style/StyleInspector";
import { ScrollArea } from "@uimix/foundation/src/components/ScrollArea";
import { projectState } from "../../state/ProjectState";
import { DocumentInspector } from "./document/DocumentInspector";
import { twMerge } from "tailwind-merge";

export const InspectorSideBar: React.FC<{
  className?: string;
}> = observer(({ className }) => {
  return (
    <div className={twMerge("w-64 flex flex-col contain-strict", className)}>
      <ScrollArea className="absolute left-0 top-0 w-full h-full">
        {projectState.selectedSelectables.length ? (
          <StyleInspector />
        ) : (
          <DocumentInspector />
        )}
      </ScrollArea>
    </div>
  );
});
InspectorSideBar.displayName = "InspectorSideBar";
