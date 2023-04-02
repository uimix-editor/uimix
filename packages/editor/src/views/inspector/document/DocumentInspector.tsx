import { observer } from "mobx-react-lite";
import { ColorTokenListPane } from "./ColorTokenListPane";

export const DocumentInspector = observer(() => {
  return (
    <>
      <ColorTokenListPane />
    </>
  );
});
