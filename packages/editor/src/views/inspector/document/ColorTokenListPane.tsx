import { observer } from "mobx-react-lite";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { IconButton } from "@uimix/foundation/src/components/IconButton";
import { ReactSortable } from "react-sortablejs";
import { projectState } from "../../../state/ProjectState";
import { action } from "mobx";
import { compact } from "lodash-es";
import { DoubleClickToEdit } from "@uimix/foundation/src/components/DoubleClickToEdit";
import { ColorPopover } from "../components/ColorInput";
import { Color } from "@uimix/foundation/src/utils/Color";
import { showContextMenu } from "../../ContextMenu";

export const ColorTokenListPane = observer(() => {
  const tokens = projectState.page?.colorTokens;
  if (!tokens) {
    return null;
  }
  const allTokens = tokens.all;

  // TODO: use TreeView

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
                tokens.add();
                projectState.undoManager.stopCapturing();
              })}
            />
          </>
        }
      />
      <div className="-mx-3">
        <ReactSortable
          list={allTokens.map((token) => ({
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
          {allTokens.map((token) => (
            <div
              className="h-8 gap-2 flex hover:bg-macaron-uiBackground px-3"
              key={token.id}
              onContextMenu={action((e: React.MouseEvent) => {
                showContextMenu(e, [
                  {
                    type: "command",
                    text: "Delete",
                    onClick: action(() => {
                      projectState.project.colorTokens.delete(token.id);
                      projectState.undoManager.stopCapturing();
                    }),
                  },
                ]);
              })}
            >
              <ColorPopover
                value={token.value ?? Color.black}
                onChange={action((color: Color) => {
                  token.value = color;
                })}
                onChangeEnd={action(() => {
                  projectState.undoManager.stopCapturing();
                })}
              >
                <div
                  className="w-6 h-6 rounded-full border border-macaron-uiBackground"
                  style={{
                    backgroundColor: token.value?.toHex(),
                  }}
                />
              </ColorPopover>
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
