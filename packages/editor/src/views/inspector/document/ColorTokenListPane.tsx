import { observer } from "mobx-react-lite";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { IconButton } from "../../../components/IconButton";
import { ReactSortable } from "react-sortablejs";
import { projectState } from "../../../state/ProjectState";
import { action } from "mobx";
import { compact } from "lodash-es";
import { DoubleClickToEdit } from "../../../components/DoubleClickToEdit";
import { ColorPopoverButton } from "../components/ColorInput";
import { Color } from "../../../utils/Color";

export const ColorTokenListPane = observer(() => {
  const tokens = projectState.project.colorTokens.all;

  // TODO: use list view?

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:palette-outline"
        text="Color Tokens"
        buttons={
          <>
            <IconButton
              icon="material-symbols:add"
              onClick={action(() => {
                projectState.project.colorTokens.add();
                projectState.undoManager.stopCapturing();
              })}
            />
          </>
        }
      />
      <div>
        <ReactSortable
          list={tokens.map((token) => ({
            id: token.id,
          }))}
          setList={action((list: { id: string }[]) => {
            const newTokens = compact(
              list.map((item) => projectState.project.colorTokens.get(item.id))
            );
            for (const [i, token] of newTokens.entries()) {
              token.index = i;
            }
            projectState.undoManager.stopCapturing();
          })}
        >
          {tokens.map((token) => (
            <div className="h-7 gap-2 flex" key={token.id}>
              <ColorPopoverButton
                value={token.value ?? Color.black}
                onChange={action((color: Color) => {
                  token.value = color;
                })}
                onChangeEnd={action(() => {
                  projectState.undoManager.stopCapturing();
                })}
              />
              <DoubleClickToEdit
                className="flex-1"
                value={token.name ?? ""}
                onChange={action((name: string) => {
                  token.name = name;
                  projectState.undoManager.stopCapturing();
                })}
              />
            </div>
          ))}
        </ReactSortable>
      </div>
    </InspectorPane>
  );
});
