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

export const FillPane: React.FC = observer(function FillPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => !s.node.isAbstract
  );
  const fills = sameOrMixed(selectables.map((s) => s.style.fills));
  const hasFill = fills && fills !== Mixed && fills.length;
  const fill = hasFill ? fills[0] : undefined;

  const onChangeFill = action((fill: Color | undefined) => {
    for (const selectable of selectables) {
      selectable.style.fills = fill
        ? [{ type: "solid", hex: fill.toHex() }]
        : [];
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
      {fills === Mixed ? (
        <div className="text-macaron-disabledText">Mixed</div>
      ) : fill ? (
        <InspectorTargetContext.Provider value={selectables}>
          <div>
            <ColorInput
              value={Color.from(fill.hex) ?? Color.black}
              onChange={onChangeFill}
              onChangeEnd={onChangeEndFill}
            />
          </div>
        </InspectorTargetContext.Provider>
      ) : null}
    </InspectorPane>
  );
});
