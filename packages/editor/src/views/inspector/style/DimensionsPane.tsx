import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { SizeConstraintType } from "@uimix/node-data";
import hugContentsIcon from "@seanchas116/design-icons/json/hug-contents.json";
import fixedSizeIcon from "@seanchas116/design-icons/json/fixed-size.json";
import fillAreaIcon from "@seanchas116/design-icons/json/fill-area.json";
import { AnchorEdit } from "../../../components/AnchorEdit";
import { InspectorNumberInput } from "./inputs/InspectorNumberInput";
import { InspectorToggleGroup } from "./inputs/InspectorToggleGroup";
import { ToggleGroupItem } from "../../../components/ToggleGroup";
import { InspectorPane } from "../components/InspectorPane";
import { projectState } from "../../../state/ProjectState";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { Selectable } from "../../../models/Selectable";
import { sameOrMixed } from "../../../utils/Mixed";
import { abstractNodeTypes } from "../../../models/Node";
import { InspectorHeading } from "../components/InspectorHeading";

const verticalSizeConstraintOptions: ToggleGroupItem<SizeConstraintType>[] = [
  {
    value: "hugContents",
    tooltip: "Hug Contents",
    content: { ...hugContentsIcon, rotate: 1 },
  },
  {
    value: "fixed",
    tooltip: "Fixed",
    content: { ...fixedSizeIcon, rotate: 1 },
  },
  {
    value: "fillContainer",
    tooltip: "Fill Container",
    content: { ...fillAreaIcon, rotate: 1 },
  },
];

const horizontalSizeConstraintOptions: ToggleGroupItem<SizeConstraintType>[] = [
  {
    value: "hugContents",
    tooltip: "Hug Contents",
    content: hugContentsIcon,
  },
  {
    value: "fixed",
    tooltip: "Fixed",
    content: fixedSizeIcon,
  },
  {
    value: "fillContainer",
    tooltip: "Fill Container",
    content: fillAreaIcon,
  },
];

const InspectorAnchorEdit = observer(function InspectorAnchorEdit({
  className,
}: {
  className?: string;
}) {
  const selectables = useContext(InspectorTargetContext);
  const xValue = sameOrMixed(selectables.map((s) => s.style.position.x.type));
  const yValue = sameOrMixed(selectables.map((s) => s.style.position.y.type));

  return (
    <AnchorEdit
      className={className}
      xValue={typeof xValue === "string" ? xValue : "scale"}
      yValue={typeof yValue === "string" ? yValue : "scale"}
      onXChange={() => {
        // TODO
      }}
      onYChange={() => {
        // TODO
      }}
    />
  );
});

export const DimensionsPane: React.FC = observer(function DimensionPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => !abstractNodeTypes.includes(s.node.type)
  );
  if (!selectables.length) {
    return null;
  }

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:straighten-outline"
        text="Dimensions"
      />
      <InspectorTargetContext.Provider value={selectables}>
        <div className="grid grid-cols-3 gap-2 items-center">
          <InspectorNumberInput
            icon="T"
            tooltip="Top"
            className="col-start-2 row-start-1"
            get={(s) =>
              s.style.position.y.type === "start"
                ? s.style.position.y.start
                : undefined
            }
            placeholder={(s) => s.computedOffsetTop}
            set={(s, value) => {
              s.style.position = {
                ...s.style.position,
                y: {
                  type: "start",
                  start: value ?? 0,
                },
              };
            }}
          />
          <InspectorNumberInput
            icon="R"
            tooltip="Right"
            className="col-start-3 row-start-2"
            placeholder={(s) => s.computedOffsetRight}
            get={(s) =>
              s.style.position.x.type === "end"
                ? s.style.position.x.end
                : undefined
            }
            set={(s, value) => {
              s.style.position = {
                ...s.style.position,
                x: {
                  type: "end",
                  end: value ?? 0,
                },
              };
            }}
          />
          <InspectorNumberInput
            icon="B"
            tooltip="Bottom"
            className="col-start-2 row-start-3"
            get={(s) =>
              s.style.position.y.type === "end"
                ? s.style.position.y.end
                : undefined
            }
            placeholder={(s) => s.computedOffsetBottom}
            set={(s, value) => {
              s.style.position = {
                ...s.style.position,
                y: {
                  type: "end",
                  end: value ?? 0,
                },
              };
            }}
          />
          <InspectorNumberInput
            icon="L"
            tooltip="Left"
            className="col-start-1 row-start-2"
            placeholder={(s) => s.computedOffsetLeft}
            get={(s) =>
              s.style.position.x.type === "start"
                ? s.style.position.x.start
                : undefined
            }
            set={(s, value) => {
              s.style.position = {
                ...s.style.position,
                x: {
                  type: "start",
                  start: value ?? 0,
                },
              };
            }}
          />
          <InspectorAnchorEdit className="col-start-2 row-start-2" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2 items-center">
            <InspectorNumberInput
              icon="W"
              tooltip="Width"
              get={(s) =>
                "value" in s.style.width ? s.style.width.value : undefined
              }
              placeholder={(s) => s.computedRect.width}
              set={(s, value) => {
                setSizeConstraintValue(s, "width", value);
              }}
            />
            <InspectorToggleGroup
              get={(s) => s.style.width.type}
              set={(s, value) => {
                setSizeConstraintType(s, "width", value);
              }}
              items={horizontalSizeConstraintOptions}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 items-center">
            <InspectorNumberInput
              icon="H"
              tooltip="Height"
              get={(s) =>
                "value" in s.style.height ? s.style.height.value : undefined
              }
              placeholder={(s) => s.computedRect.height}
              set={(s, value) => {
                setSizeConstraintValue(s, "height", value);
              }}
            />
            <InspectorToggleGroup
              get={(s) => s.style.height.type}
              set={(s, value) => {
                setSizeConstraintType(s, "height", value);
              }}
              items={verticalSizeConstraintOptions}
            />
          </div>
        </div>
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});

function setSizeConstraintValue(
  selectable: Selectable,
  target: "width" | "height",
  value: number | undefined
) {
  const { style } = selectable;
  const constraint = style[target];

  switch (constraint.type) {
    case "hugContents":
    case "fixed":
      style[target] = {
        type: "fixed",
        value: value ?? 0,
      };
      break;
    case "fillContainer":
      style[target] = {
        ...constraint,
        value,
      };
      break;
  }
}

function setSizeConstraintType(
  selectable: Selectable,
  target: "width" | "height",
  type: SizeConstraintType | undefined
) {
  const { style } = selectable;
  const constraint = style[target];

  const oldValue = "value" in constraint ? constraint.value : undefined;

  const computedSize = selectable.computedRect[target];

  switch (type) {
    case "hugContents":
      style[target] = { type: "hugContents" };
      break;
    case "fixed":
      style[target] = {
        type: "fixed",
        value: oldValue ?? computedSize,
      };
      break;
    case "fillContainer":
      style[target] = {
        type: "fillContainer",
        value: oldValue ?? computedSize,
      };
      break;
  }
}
