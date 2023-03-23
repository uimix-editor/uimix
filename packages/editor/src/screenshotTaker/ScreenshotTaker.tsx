import { state } from "./State";
import { Node } from "../models/Node";
import { observer } from "mobx-react-lite";
import { NodeRenderer } from "../views/viewport/renderer/NodeRenderer";

export const ScreenshotTaker: React.FC = observer(() => {
  const page: Node | undefined = state.project.pages.all[0];

  return (
    <div>
      {page?.selectable.children.map((child) => {
        return <NodeRenderer key={child.id} selectable={child} />;
      })}
    </div>
  );
});
