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
import { Tooltip } from "../../../components/Tooltip";
import * as RadixPopover from "@radix-ui/react-popover";
import { SearchInput } from "../../outline/SearchInput";
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
            <RadixPopover.Root>
              <Tooltip text="Color Tokens">
                <RadixPopover.Trigger asChild>
                  <IconButton
                    icon="material-symbols:palette-outline"
                    onClick={action(() => {
                      // TODO
                    })}
                  />
                </RadixPopover.Trigger>
              </Tooltip>
              <RadixPopover.Portal>
                <RadixPopover.Content
                  align="start"
                  className="bg-macaron-background z-10 border border-macaron-separator rounded-lg shadow-xl overflow-hidden text-xs"
                >
                  <SearchInput
                    placeholder="Search"
                    value={""}
                    onChangeValue={action((value) => {
                      // TODO
                    })}
                  />
                  <div className="w-64 p-3">
                    <div className="text-macaron-label font-medium mb-2">
                      This Document
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {projectState.project.colorTokens.all.map((token) => {
                        return (
                          <Tooltip
                            text={token.name}
                            key={token.id}
                            delayDuration={0}
                          >
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{
                                backgroundColor: token.value?.toHex(),
                              }}
                              onClick={action(() => {
                                onChangeFill(token);
                                onChangeEndFill();
                              })}
                            />
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                </RadixPopover.Content>
              </RadixPopover.Portal>
            </RadixPopover.Root>

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
            {typeof fill.color === "string" ? (
              <ColorInput
                value={Color.from(fill.color) ?? Color.black}
                onChange={onChangeFill}
                onChangeEnd={onChangeEndFill}
              />
            ) : (
              <div>
                {projectState.project.colorTokens.get(fill.color.id)?.name}
              </div>
            )}
          </div>
        ) : null}
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});
