import { observer } from "mobx-react-lite";
import { NodeRenderer } from "../views/viewport/renderer/NodeRenderer";
import { ForeignComponentManager } from "../models/ForeignComponentManager";
import { projectState } from "../state/ProjectState";
import { assertNonNull } from "@uimix/foundation/src/utils/Assert";
import { Page } from "../models/Page";

export const ThumbnailTaker: React.FC = observer(() => {
  const page: Page | undefined = projectState.project.pages.all[0];
  const foreignComponentManager = assertNonNull(ForeignComponentManager.global);

  return (
    <div>
      {page?.selectable.children.map((child) => {
        return (
          <NodeRenderer
            key={child.id}
            selectable={child}
            foreignComponentManager={foreignComponentManager}
          />
        );
      })}
    </div>
  );
});
