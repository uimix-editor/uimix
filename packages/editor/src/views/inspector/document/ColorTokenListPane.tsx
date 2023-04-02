import { observer } from "mobx-react-lite";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";

export const ColorTokenListPane = observer(() => {
  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:palette-outline"
        text="Color Tokens"
      />
      <div>TODO</div>
    </InspectorPane>
  );
});
