import { observer } from "mobx-react-lite";
import addIcon from "@iconify-icons/ic/add";
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
import { Shadow } from "@uimix/node-data";
import { ColorRef } from "../../../models/ColorRef";

function nanToZero(value: number) {
  return isNaN(value) ? 0 : value;
}

export const ShadowPane: React.FC = observer(function ShadowPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => !s.node.isAbstract
  );
  const shadows = sameOrMixed(selectables.map((s) => s.style.shadows));
  const hasShadow = !!(shadows && shadows !== Mixed && shadows.length);

  const onChangeShadow = action((shadow: Shadow, index: number) => {
    for (const selectable of selectables) {
      const shadows = [...(selectable.style.shadows ?? [])];
      shadows[index] = shadow;
      selectable.style.shadows = shadows;
    }
  });

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
              onClick={action(() => {
                for (const selectable of selectables) {
                  const newShadow: Shadow = {
                    color: Color.black.withAlpha(0.25).toHex(),
                    x: 0,
                    y: 0,
                    blur: 16,
                    spread: 0,
                  };
                  selectable.style.shadows = [
                    ...selectable.style.shadows,
                    newShadow,
                  ];
                }
                projectState.undoManager.stopCapturing();
              })}
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
                    value={ColorRef.fromJSON(
                      projectState.project,
                      shadow.color
                    )}
                    onChange={action((color) => {
                      const newShadow = { ...shadow, color: color.toJSON() };
                      onChangeShadow(newShadow, i);
                    })}
                    onChangeEnd={action(() => {
                      projectState.undoManager.stopCapturing();
                    })}
                  />
                  <div className="grid grid-cols-4 gap-1">
                    <Input
                      // TODO: refactor to NumberInput?
                      icon="X"
                      value={String(shadow.x)}
                      onChange={action((value) => {
                        const newShadow = {
                          ...shadow,
                          x: nanToZero(Number(value)),
                        };
                        onChangeShadow(newShadow, i);
                        projectState.undoManager.stopCapturing();
                      })}
                    />
                    <Input
                      icon="Y"
                      value={String(shadow.y)}
                      onChange={action((value) => {
                        const newShadow = {
                          ...shadow,
                          y: nanToZero(Number(value)),
                        };
                        onChangeShadow(newShadow, i);
                        projectState.undoManager.stopCapturing();
                      })}
                    />
                    <Input
                      icon="B"
                      value={String(shadow.blur)}
                      onChange={action((value) => {
                        const newShadow = {
                          ...shadow,
                          blur: nanToZero(Number(value)),
                        };
                        onChangeShadow(newShadow, i);
                        projectState.undoManager.stopCapturing();
                      })}
                    />
                    <Input
                      icon="S"
                      value={String(shadow.spread)}
                      onChange={action((value) => {
                        const newShadow = {
                          ...shadow,
                          spread: nanToZero(Number(value)),
                        };
                        onChangeShadow(newShadow, i);
                        projectState.undoManager.stopCapturing();
                      })}
                    />
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
                      onClick: action(() => {
                        if (i === 0 || shadows.length === 1) {
                          return;
                        }
                        const newShadows = [...shadows];
                        const shadow = newShadows[i];
                        newShadows.splice(i, 1);
                        newShadows.splice(i - 1, 0, shadow);
                        for (const selectable of selectables) {
                          selectable.style.shadows = newShadows;
                        }
                        projectState.undoManager.stopCapturing();
                      }),
                    },
                    {
                      type: "command",
                      text: "Move Down",
                      onClick: action(() => {
                        if (i === shadows.length - 1 || shadows.length === 1) {
                          return;
                        }
                        const newShadows = [...shadows];
                        const shadow = newShadows[i];
                        newShadows.splice(i, 1);
                        newShadows.splice(i + 1, 0, shadow);
                        for (const selectable of selectables) {
                          selectable.style.shadows = newShadows;
                        }
                        projectState.undoManager.stopCapturing();
                      }),
                    },
                    {
                      type: "separator",
                    },
                    {
                      type: "command",
                      text: "Remove",
                      onClick: action(() => {
                        const newShadows = [...shadows];
                        newShadows.splice(i, 1);
                        for (const selectable of selectables) {
                          selectable.style.shadows = newShadows;
                        }
                        projectState.undoManager.stopCapturing();
                      }),
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
