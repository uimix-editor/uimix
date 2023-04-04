import { observer } from "mobx-react-lite";
import { StyleInspector } from "./style/StyleInspector";
import { ScrollArea } from "@uimix/foundation/src/components/ScrollArea";
import { projectState } from "../../state/ProjectState";
import { DocumentInspector } from "./document/DocumentInspector";

export const InspectorSideBar: React.FC = observer(() => {
  return (
    <div className="w-[256px] flex flex-col contain-strict">
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
