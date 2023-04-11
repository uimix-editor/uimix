import { observer } from "mobx-react-lite";
import addIcon from "@iconify-icons/ic/add";
import removeIcon from "@iconify-icons/ic/remove";
import { Color } from "@uimix/foundation/src/utils/Color";
import { Mixed, sameOrMixed } from "@uimix/foundation/src/utils/Mixed";
import { ColorInput } from "../components/ColorInput";
import { projectState } from "../../../state/ProjectState";
import { IconButton } from "@uimix/foundation/src/components/IconButton";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { action } from "mobx";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { ColorRef } from "@uimix/model/src/models";

export const FillPane: React.FC = observer(function FillPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => !s.node.isAbstract
  );
  const fills = sameOrMixed(selectables.map((s) => s.style.fills));
  const hasFill = fills && fills !== Mixed && fills.length;
  const fill = hasFill ? fills[0] : undefined;

  const onChangeFill = action((color: ColorRef | undefined) => {
    for (const selectable of selectables) {
      if (color) {
        selectable.style.fills = [{ type: "solid", color: color.toJSON() }];
      } else {
        selectable.style.fills = [];
      }
    }
  });
  const onChangeEndFill = action(() => {
    projectState.undoManager.stopCapturing();
  });

  if (!selectables.length) {
    return null;
  }

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:format-paint-outline-rounded"
        text="Fill"
        dimmed={!hasFill}
        buttons={
          <div className="flex gap-1">
            {hasFill ? (
              <IconButton
                icon={removeIcon}
                onClick={() => {
                  onChangeFill(undefined);
                }}
              />
            ) : (
              <IconButton
                icon={addIcon}
                onClick={() => {
                  onChangeFill(new ColorRef(Color.from("gray")));
                }}
              />
            )}
          </div>
        }
      />
      <InspectorTargetContext.Provider value={selectables}>
        {fills === Mixed ? (
          <div className="text-macaron-disabledText">Mixed</div>
        ) : fill ? (
          <div>
            <ColorInput
              value={ColorRef.fromJSON(projectState.project, fill.color)}
              onChange={onChangeFill}
              onChangeEnd={onChangeEndFill}
            />
          </div>
        ) : null}
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});
