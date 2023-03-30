import { observer } from "mobx-react-lite";
import edgeTopIcon from "@seanchas116/design-icons/json/edge-top.json";
import addIcon from "@iconify-icons/ic/add";
import removeIcon from "@iconify-icons/ic/remove";
import arrowForwardIcon from "@iconify-icons/ic/arrow-forward";
import spaceBarIcon from "@iconify-icons/ic/space-bar";
import verticalAlignTopIcon from "@iconify-icons/ic/vertical-align-top";
import verticalDistributeIcon from "@iconify-icons/ic/outline-vertical-distribute";
import { InspectorNumberInput } from "./inputs/InspectorNumberInput";
import { InspectorToggleGroup } from "./inputs/InspectorToggleGroup";
import { sameOrMixed } from "../../../utils/Mixed";
import { projectState } from "../../../state/ProjectState";
import { IconButton } from "../../../components/IconButton";
import { StackDirection } from "@uimix/node-data";
import { AlignmentEdit } from "../../../components/AlignmentEdit";
import { ToggleGroupItem } from "../../../components/ToggleGroup";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorPane } from "../components/InspectorPane";
import { action } from "mobx";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { commands } from "../../../state/Commands";
import { Tooltip } from "../../../components/Tooltip";
import { DropdownMenu } from "../../../components/Menu";
import { gapToMargins, marginsToGap } from "../../../services/AutoLayout";
import { Icon } from "@iconify/react";

const StackAlignmentEdit = observer(function StackAlignmentEdit({
  direction,
  className,
}: {
  direction: StackDirection;
  className?: string;
}) {
  const selectables = projectState.selectedSelectables;
  const align = sameOrMixed(selectables.map((s) => s.style.flexAlign));
  const justify = sameOrMixed(selectables.map((s) => s.style.flexJustify));

  return (
    <AlignmentEdit
      className={className}
      direction={direction}
      align={typeof align === "string" ? align : undefined}
      justify={typeof justify === "string" ? justify : undefined}
      onChange={action((align, justify) => {
        for (const selectable of selectables) {
          selectable.style.flexAlign = align ?? "start";
          selectable.style.flexJustify = justify ?? "start";
        }
        projectState.undoManager.stopCapturing();
      })}
    />
  );
});

const stackDirectionOptions: ToggleGroupItem<"grid" | "x" | "y">[] = [
  {
    value: "grid",
    tooltip: "Grid",
    icon: "icon-park-outline:all-application",
  },
  {
    value: "x",
    tooltip: "Horizontal",
    icon: arrowForwardIcon,
  },
  {
    value: "y",
    tooltip: "Vertical",
    icon: {
      ...arrowForwardIcon,
      rotate: 1,
    },
  },
];

export const LayoutPane: React.FC = observer(function StackPane() {
  const frameSelectables = projectState.selectedSelectables.filter(
    (s) => s.node.type === "frame"
  );
  const layoutSelectables = frameSelectables.filter(
    (s) => s.style.layout !== "none"
  );

  const hasLayout = layoutSelectables.length > 0;
  let direction = sameOrMixed<"x" | "y">(
    layoutSelectables.map((s) => s.style.flexDirection)
  );
  if (typeof direction !== "string") {
    direction = "x";
  }
  const hasGrid = frameSelectables.some((s) => s.style.layout === "grid");

  if (frameSelectables.length === 0) {
    return null;
  }

  const hasGap = layoutSelectables.some(
    (s) => s.style.rowGap !== 0 || s.style.columnGap !== 0
  );

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:table-rows-outline"
        text="Layout"
        dimmed={!hasLayout}
        buttons={
          <div className="flex gap-1">
            {/* <Tooltip text="Margin-based layout">
              <IconButton icon="icon-park-outline:margin-one" />
            </Tooltip>
            <Tooltip text="Gap-based layout">
              <IconButton icon="icon-park-outline:vertical-tidy-up" />
            </Tooltip> */}
            {hasLayout ? (
              <>
                {hasGap ? (
                  <Tooltip text="Gap to Margins">
                    <IconButton
                      icon="icon-park-outline:margin-one"
                      rotate={direction === "x" ? 1 : 0}
                      onClick={action(() => {
                        for (const selectable of layoutSelectables) {
                          gapToMargins(selectable);
                        }
                        projectState.undoManager.stopCapturing();
                      })}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip text="Margins to Gap">
                    <IconButton
                      icon="icon-park-outline:vertical-tidy-up"
                      rotate={direction === "x" ? 1 : 0}
                      onClick={action(() => {
                        for (const selectable of layoutSelectables) {
                          marginsToGap(selectable);
                        }
                        projectState.undoManager.stopCapturing();
                      })}
                    />
                  </Tooltip>
                )}
                <Tooltip text="Remove Layout">
                  <IconButton
                    icon={removeIcon}
                    onClick={action(() => {
                      commands.removeLayout();
                    })}
                  />
                </Tooltip>
              </>
            ) : (
              <Tooltip text="Add Layout">
                <IconButton
                  icon={addIcon}
                  onClick={action(() => {
                    commands.autoLayout();
                  })}
                />
              </Tooltip>
            )}
          </div>
        }
      />
      {hasLayout && (
        <InspectorTargetContext.Provider value={layoutSelectables}>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2 items-center">
              <InspectorToggleGroup
                get={(s) => {
                  if (s.style.layout === "grid") {
                    return "grid";
                  }
                  return s.style.flexDirection;
                }}
                set={(s, value) => {
                  if (value === "grid") {
                    s.style.layout = "grid";
                  } else {
                    s.style.layout = "flex";
                    s.style.flexDirection = value ?? "x";
                  }
                }}
                items={stackDirectionOptions}
              />
              <InspectorToggleGroup
                get={(s) =>
                  s.style.flexJustify === "spaceBetween" ? "between" : "packed"
                }
                set={(s, value) => {
                  s.style.flexJustify =
                    value === "between" ? "spaceBetween" : "start";
                }}
                items={[
                  {
                    value: "packed",
                    tooltip: "Packed",
                    icon: {
                      ...verticalAlignTopIcon,
                      rotate: direction === "x" ? 3 : 0,
                    },
                  },
                  {
                    value: "between",
                    tooltip: "Space Between",
                    icon: {
                      ...verticalDistributeIcon,
                      rotate: direction === "x" ? 1 : 0,
                    },
                  },
                ]}
              />
              <InspectorNumberInput
                icon={spaceBarIcon}
                tooltip="Gap"
                get={(s) => ({ value: s.style.rowGap })} // TODO: separate row/column gap
                set={(s, value) => {
                  s.style.rowGap = value?.value ?? 0;
                  s.style.columnGap = value?.value ?? 0;
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <InspectorNumberInput
                icon={edgeTopIcon}
                tooltip="Padding Top"
                className="col-start-2 row-start-1"
                get={(s) => ({ value: s.style.paddingTop })}
                set={(s, value) => {
                  s.style.paddingTop = value?.value ?? 0;
                }}
              />
              <InspectorNumberInput
                icon={{
                  ...edgeTopIcon,
                  rotate: 1,
                }}
                tooltip="Padding Right"
                className="col-start-3 row-start-2"
                get={(s) => ({ value: s.style.paddingRight })}
                set={(s, value) => {
                  s.style.paddingRight = value?.value ?? 0;
                }}
              />
              <InspectorNumberInput
                icon={{
                  ...edgeTopIcon,
                  rotate: 2,
                }}
                tooltip="Padding Bottom"
                className="col-start-2 row-start-3"
                get={(s) => ({ value: s.style.paddingBottom })}
                set={(s, value) => {
                  s.style.paddingBottom = value?.value ?? 0;
                }}
              />
              <InspectorNumberInput
                icon={{
                  ...edgeTopIcon,
                  rotate: 3,
                }}
                tooltip="Padding Left"
                className="col-start-1 row-start-2"
                get={(s) => ({ value: s.style.paddingLeft })}
                set={(s, value) => {
                  s.style.paddingLeft = value?.value ?? 0;
                }}
              />
              <StackAlignmentEdit
                direction={direction}
                className="col-start-2 row-start-2"
              />
            </div>
          </div>
          {hasGrid && (
            <div className="grid grid-cols-3 gap-2 items-center">
              <InspectorNumberInput
                icon={<Icon width={12} icon="icon-park-outline:column" />}
                tooltip="Column Count"
                get={(s) => {
                  const value = s.style.gridColumnCount;
                  if (value !== null) {
                    return { value };
                  }
                }}
                placeholder={() => "Auto"}
                set={(s, value) => {
                  s.style.gridColumnCount = value?.value ?? null;
                }}
              />
              <InspectorNumberInput
                icon={
                  <Icon width={12} icon="icon-park-outline:column" rotate={1} />
                }
                tooltip="Row Count"
                get={(s) => {
                  const value = s.style.gridRowCount;
                  if (value !== null) {
                    return { value };
                  }
                }}
                placeholder={() => "Auto"}
                set={(s, value) => {
                  s.style.gridRowCount = value?.value ?? null;
                }}
              />
            </div>
          )}
        </InspectorTargetContext.Provider>
      )}
    </InspectorPane>
  );
});
