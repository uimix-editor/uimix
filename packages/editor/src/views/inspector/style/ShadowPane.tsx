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
import { Input } from "../../../components/Input";
import { DropdownMenu } from "../../../components/Menu";

export const ShadowPane: React.FC = observer(function ShadowPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => !s.node.isAbstract
  );
  const shadows = sameOrMixed(selectables.map((s) => s.style.shadows));
  const hasShadow = !!(shadows && shadows !== Mixed && shadows.length);

  // const onChangeFill = action((fill: Color | undefined) => {
  //   for (const selectable of selectables) {
  //     selectable.style.fills = fill
  //       ? [{ type: "solid", hex: fill.toHex() }]
  //       : [];
  //   }
  // });
  // const onChangeEndFill = action(() => {
  //   projectState.undoManager.stopCapturing();
  // });

  if (!selectables.length) {
    return null;
  }

  return (
    <InspectorTargetContext.Provider value={selectables}>
      <InspectorPane>
        <InspectorHeading
          icon="material-symbols:format-paint-outline-rounded"
          text="Shadow"
          dimmed={!hasShadow}
          buttons={
            <IconButton
              icon={addIcon}
              onClick={() => {
                //onChangeFill(Color.from("gray"));
              }}
            />
          }
        />
        {shadows === Mixed ? (
          <div className="text-macaron-disabledText">Mixed</div>
        ) : (
          shadows?.map((shadow, i) => {
            return (
              <div className="flex gap-2 items-center">
                <div className="flex flex-col gap-2">
                  <ColorInput
                    value={Color.from(shadow.hex) ?? Color.black}
                    // onChange={onChangeFill}
                    // onChangeEnd={onChangeEndFill}
                  />
                  <div className="grid grid-cols-4 gap-1">
                    <Input icon="X" />
                    <Input icon="Y" />
                    <Input icon="B" />
                    <Input icon="S" />
                  </div>
                </div>
                <DropdownMenu
                  trigger={(props) => (
                    <IconButton {...props} icon="material-symbols:more-horiz" />
                  )}
                  defs={[
                    {
                      type: "command",
                      text: "Move Up",
                    },
                    {
                      type: "command",
                      text: "Move Down",
                    },
                    {
                      type: "separator",
                    },
                    {
                      type: "command",
                      text: "Remove",
                    },
                  ]}
                />
              </div>
            );
          })
        )}
      </InspectorPane>
    </InspectorTargetContext.Provider>
  );
});
