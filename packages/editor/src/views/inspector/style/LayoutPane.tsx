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

const StackAlignmentEdit = observer(function StackAlignmentEdit({
  direction,
  className,
}: {
  direction: StackDirection;
  className?: string;
}) {
  const selectables = projectState.selectedSelectables;
  const align = sameOrMixed(selectables.map((s) => s.style.stackAlign));
  const justify = sameOrMixed(selectables.map((s) => s.style.stackJustify));

  return (
    <AlignmentEdit
      className={className}
      direction={direction}
      align={typeof align === "string" ? align : undefined}
      justify={typeof justify === "string" ? justify : undefined}
      onChange={action((align, justify) => {
        for (const selectable of selectables) {
          selectable.style.stackAlign = align ?? "start";
          selectable.style.stackJustify = justify ?? "start";
        }
        projectState.undoManager.stopCapturing();
      })}
    />
  );
});

const stackDirectionOptions: ToggleGroupItem<StackDirection>[] = [
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
  const stackSelectables = frameSelectables.filter(
    (s) => s.style.layout === "stack"
  );

  const hasStack = stackSelectables.length > 0;
  let direction = sameOrMixed<"x" | "y">(
    stackSelectables.map((s) => s.style.stackDirection)
  );
  if (typeof direction !== "string") {
    direction = "x";
  }

  if (frameSelectables.length === 0) {
    return null;
  }

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:table-rows-outline"
        text="Layout"
        dimmed={!hasStack}
        buttons={
          hasStack ? (
            <IconButton
              icon={removeIcon}
              onClick={action(() => {
                commands.removeLayout();
              })}
            />
          ) : (
            <IconButton
              icon={addIcon}
              onClick={action(() => {
                commands.autoLayout();
              })}
            />
          )
        }
      />
      {hasStack && (
        <InspectorTargetContext.Provider value={stackSelectables}>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2 items-center">
              <InspectorToggleGroup
                get={(s) => s.style.stackDirection}
                set={(s, value) => {
                  s.style.stackDirection = value ?? "x";
                }}
                items={stackDirectionOptions}
              />
              <InspectorToggleGroup
                get={(s) =>
                  s.style.stackJustify === "spaceBetween" ? "between" : "packed"
                }
                set={(s, value) => {
                  s.style.stackJustify =
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
                get={(s) => ({ value: s.style.gap })}
                set={(s, value) => {
                  s.style.gap = value?.value ?? 0;
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
        </InspectorTargetContext.Provider>
      )}
    </InspectorPane>
  );
});
