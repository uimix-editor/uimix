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
import { abstractNodeTypes } from "../../../models/Node";

export const FillPane: React.FC = observer(function FillPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => !abstractNodeTypes.includes(s.node.type)
  );
  const fill = sameOrMixed(selectables.map((s) => s.style.fill));
  const hasFill = fill && fill !== Mixed;

  const onChangeFill = action((fill: Color | undefined) => {
    for (const selectable of selectables) {
      selectable.style.fill = fill?.toHex() ?? null;
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
          hasFill ? (
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
          )
        }
      />
      {fill === Mixed ? (
        <div className="text-macaron-disabledText">Mixed</div>
      ) : fill ? (
        <InspectorTargetContext.Provider value={selectables}>
          <div>
            <ColorInput
              value={Color.from(fill) ?? Color.black}
              onChange={onChangeFill}
              onChangeEnd={onChangeEndFill}
            />
          </div>
        </InspectorTargetContext.Provider>
      ) : null}
    </InspectorPane>
  );
});
