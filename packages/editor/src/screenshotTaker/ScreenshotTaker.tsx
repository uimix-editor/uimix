import { Node } from "../models/Node";
import { observer } from "mobx-react-lite";
import { NodeRenderer } from "../views/viewport/renderer/NodeRenderer";
import { ForeignComponentManager } from "../models/ForeignComponentManager";
import { projectState } from "../state/ProjectState";

export const ScreenshotTaker: React.FC = observer(() => {
  const page: Node | undefined = projectState.project.pages.all[0];

  return (
    <div>
      {page?.selectable.children.map((child) => {
        return (
          <NodeRenderer
            key={child.id}
            selectable={child}
            foreignComponentManager={ForeignComponentManager.global!}
          />
        );
      })}
    </div>
  );
});