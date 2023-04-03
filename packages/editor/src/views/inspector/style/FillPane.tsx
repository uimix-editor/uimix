import { observer } from "mobx-react-lite";
import addIcon from "@iconify-icons/ic/add";
import removeIcon from "@iconify-icons/ic/remove";
import { Color } from "../../../utils/Color";
import { ColorInput } from "../components/ColorInput";
import { Mixed, sameOrMixed } from "../../../utils/Mixed";
import { projectState } from "../../../state/ProjectState";
import { IconButton } from "../../../components/IconButton";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { action } from "mobx";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { ColorToken } from "../../../models/ColorToken";

export const FillPane: React.FC = observer(function FillPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => !s.node.isAbstract
  );
  const fills = sameOrMixed(selectables.map((s) => s.style.fills));
  const hasFill = fills && fills !== Mixed && fills.length;
  const fill = hasFill ? fills[0] : undefined;

  const onChangeFill = action((fill: Color | ColorToken | undefined) => {
    for (const selectable of selectables) {
      if (fill instanceof Color) {
        selectable.style.fills = [{ type: "solid", color: fill.toHex() }];
      } else if (fill instanceof ColorToken) {
        selectable.style.fills = [
          { type: "solid", color: { type: "token", id: fill.id } },
        ];
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
                  onChangeFill(Color.from("gray"));
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
              value={
                typeof fill.color === "string"
                  ? Color.from(fill.color)
                  : projectState.project.colorTokens.get(fill.color.id)
              }
              onChange={onChangeFill}
              onChangeEnd={onChangeEndFill}
            />
          </div>
        ) : null}
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});
