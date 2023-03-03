import { observer } from "mobx-react-lite";
import { StyleInspector } from "./style/StyleInspector";
import { ScrollArea } from "../../components/ScrollArea";

export const InspectorSideBar: React.FC = observer(() => {
  return (
    <div className="w-[232px] flex flex-col contain-strict">
      <ScrollArea className="absolute left-0 top-0 w-full h-full">
        <StyleInspector />
      </ScrollArea>
    </div>
  );
});
InspectorSideBar.displayName = "InspectorSideBar";
