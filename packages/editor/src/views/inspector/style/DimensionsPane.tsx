import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { SizeConstraintType } from "@uimix/node-data";
import hugContentsIcon from "@seanchas116/design-icons/json/hug-contents.json";
import fixedSizeIcon from "@seanchas116/design-icons/json/fixed-size.json";
import fillAreaIcon from "@seanchas116/design-icons/json/fill-area.json";
import radiusIcon from "@seanchas116/design-icons/json/radius.json";
import separateCornersIcon from "@seanchas116/design-icons/json/separate-corners.json";
import { AnchorEdit } from "../../../components/AnchorEdit";
import { InspectorNumberInput } from "./inputs/InspectorNumberInput";
import { InspectorToggleGroup } from "./inputs/InspectorToggleGroup";
import { ToggleGroupItem } from "../../../components/ToggleGroup";
import { InspectorPane } from "../components/InspectorPane";
import { projectState } from "../../../state/ProjectState";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { Selectable } from "../../../models/Selectable";
import { sameOrMixed } from "../../../utils/Mixed";
import { InspectorHeading } from "../components/InspectorHeading";
import { SeparableInput } from "../../../components/SeparableInput";
import { InspectorCheckBox } from "./inputs/InspectorCheckBox";

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

function RadiusEdit() {
  const selectables = useContext(InspectorTargetContext);
  const topLeft = sameOrMixed(selectables.map((s) => s.style.topLeftRadius));
  const topRight = sameOrMixed(selectables.map((s) => s.style.topRightRadius));
  const bottomRight = sameOrMixed(
    selectables.map((s) => s.style.bottomRightRadius)
  );
  const bottomLeft = sameOrMixed(
    selectables.map((s) => s.style.bottomLeftRadius)
  );

  return (
    <SeparableInput
      title="Border Width"
      values={{
        top: String(topLeft),
        right: String(topRight),
        bottom: String(bottomRight),
        left: String(bottomLeft),
      }}
      edgeIcons={{
        all: radiusIcon,
        top: radiusIcon,
        right: { ...radiusIcon, rotate: 1 },
        bottom: { ...radiusIcon, rotate: 2 },
        left: { ...radiusIcon, rotate: 3 },
      }}
      toggleIcon={separateCornersIcon}
      onChange={(edge, value) => {
        let numValue = Number.parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
          numValue = 0;
        }

        for (const selectable of selectables) {
          switch (edge) {
            case "top":
              selectable.style.topLeftRadius = [numValue, "px"];
              break;
            case "right":
              selectable.style.topRightRadius = [numValue, "px"];
              break;
            case "bottom":
              selectable.style.bottomRightRadius = [numValue, "px"];
              break;
            case "left":
              selectable.style.bottomLeftRadius = [numValue, "px"];
              break;
            case "all":
              selectable.style.topLeftRadius = [numValue, "px"];
              selectable.style.topRightRadius = [numValue, "px"];
              selectable.style.bottomRightRadius = [numValue, "px"];
              selectable.style.bottomLeftRadius = [numValue, "px"];
              break;
          }
        }

        projectState.undoManager.stopCapturing();

        return true;
      }}
    />
  );
}

export const DimensionsPane: React.FC = observer(function DimensionPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => !s.node.isAbstract
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
                ? s.style.position.y.start[0]
                : undefined
            }
            placeholder={(s) => s.computedOffsetTop}
            set={(s, value) => {
              s.style.position = {
                ...s.style.position,
                y: {
                  type: "start",
                  start: [value ?? 0, "px"],
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
                ? s.style.position.x.end[0]
                : undefined
            }
            set={(s, value) => {
              s.style.position = {
                ...s.style.position,
                x: {
                  type: "end",
                  end: [value ?? 0, "px"],
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
                ? s.style.position.y.end[0]
                : undefined
            }
            placeholder={(s) => s.computedOffsetBottom}
            set={(s, value) => {
              s.style.position = {
                ...s.style.position,
                y: {
                  type: "end",
                  end: [value ?? 0, "px"],
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
                ? s.style.position.x.start[0]
                : undefined
            }
            set={(s, value) => {
              s.style.position = {
                ...s.style.position,
                x: {
                  type: "start",
                  start: [value ?? 0, "px"],
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
                "value" in s.style.width ? s.style.width.value?.[0] : undefined
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
                "value" in s.style.height
                  ? s.style.height.value?.[0]
                  : undefined
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
        <RadiusEdit />
        <label className="flex items-center gap-2">
          <InspectorCheckBox
            get={(s) => s.style.overflowHidden}
            set={(s, value) => {
              s.style.overflowHidden = !!value;
            }}
          />
          Hides Overflow
        </label>
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
        value: [value ?? 0, "px"],
      };
      break;
    case "fillContainer":
      style[target] = {
        ...constraint,
        value: value !== undefined ? [value, "px"] : undefined,
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
        value: oldValue ?? [computedSize, "px"],
      };
      break;
    case "fillContainer":
      style[target] = {
        type: "fillContainer",
        value: oldValue ?? [computedSize, "px"],
      };
      break;
  }
}
