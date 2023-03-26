import { useContext } from "react";
import { observer } from "mobx-react-lite";
import {
  PositionConstraint,
  PositionConstraintType,
  SizeConstraintType,
} from "@uimix/node-data";
import hugContentsIcon from "@seanchas116/design-icons/json/hug-contents.json";
import fixedSizeIcon from "@seanchas116/design-icons/json/fixed-size.json";
import fillAreaIcon from "@seanchas116/design-icons/json/fill-area.json";
import radiusIcon from "@seanchas116/design-icons/json/radius.json";
import separateCornersIcon from "@seanchas116/design-icons/json/separate-corners.json";
import pinIcon from "@iconify-icons/ic/outline-location-on";
import staticPositionIcon from "@seanchas116/design-icons/json/static-position.json";
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
import { action } from "mobx";
import { SimpleAnchorEdit } from "../../../components/SimpleAnchorEdit";
import { InspectorToggleButton } from "./inputs/InspectorToggleButton";
import edgeTopIcon from "@seanchas116/design-icons/json/edge-top.json";

const verticalSizeConstraintOptions: ToggleGroupItem<SizeConstraintType>[] = [
  {
    value: "hugContents",
    tooltip: "Hug Contents",
    icon: { ...hugContentsIcon, rotate: 1 },
  },
  {
    value: "fixed",
    tooltip: "Fixed",
    icon: { ...fixedSizeIcon, rotate: 1 },
  },
  {
    value: "fillContainer",
    tooltip: "Fill Container",
    icon: { ...fillAreaIcon, rotate: 1 },
  },
];

const horizontalSizeConstraintOptions: ToggleGroupItem<SizeConstraintType>[] = [
  {
    value: "hugContents",
    tooltip: "Hug Contents",
    icon: hugContentsIcon,
  },
  {
    value: "fixed",
    tooltip: "Fixed",
    icon: fixedSizeIcon,
  },
  {
    value: "fillContainer",
    tooltip: "Fill Container",
    icon: fillAreaIcon,
  },
];

const positionTypeOptions: ToggleGroupItem<"absolute" | "relative">[] = [
  {
    value: "relative",
    tooltip: "Relative",
    icon: staticPositionIcon,
  },
  {
    value: "absolute",
    tooltip: "Absolute",
    icon: pinIcon,
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
    <SimpleAnchorEdit
      className={className}
      xValue={typeof xValue === "string" ? xValue : "start"}
      yValue={typeof yValue === "string" ? yValue : "start"}
      onXChange={action((value) => {
        for (const selectable of selectables) {
          setPositionStartConstraintType(selectable, "x", value);
        }
        projectState.undoManager.stopCapturing();
      })}
      onYChange={action((value) => {
        for (const selectable of selectables) {
          setPositionStartConstraintType(selectable, "y", value);
        }
        projectState.undoManager.stopCapturing();
      })}
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
              selectable.style.topLeftRadius = numValue;
              break;
            case "right":
              selectable.style.topRightRadius = numValue;
              break;
            case "bottom":
              selectable.style.bottomRightRadius = numValue;
              break;
            case "left":
              selectable.style.bottomLeftRadius = numValue;
              break;
            case "all":
              selectable.style.topLeftRadius = numValue;
              selectable.style.topRightRadius = numValue;
              selectable.style.bottomRightRadius = numValue;
              selectable.style.bottomLeftRadius = numValue;
              break;
          }
        }

        projectState.undoManager.stopCapturing();

        return true;
      }}
    />
  );
}

const WidthEdit = observer(function WidthEdit() {
  const targets = useContext(InspectorTargetContext);
  const constraint = sameOrMixed(targets.map((s) => s.style.width.type));

  return (
    <div className="grid grid-cols-3 gap-2 items-center">
      <InspectorNumberInput
        icon="W"
        tooltip="Width"
        get={(s) => {
          const width = s.style.width;
          if (width && "value" in width && width.value) {
            return {
              value: width.value,
            };
          }
        }}
        placeholder={(s) => s.computedRect.width}
        set={(s, value) => {
          setSizeConstraintValue(s, "width", value?.value);
        }}
      />
      <InspectorToggleGroup
        get={(s) => s.style.width.type}
        set={(s, value) => {
          setSizeConstraintType(s, "width", value);
        }}
        items={horizontalSizeConstraintOptions}
      />
      {constraint === "fillContainer" && (
        <>
          <div />
          <InspectorNumberInput
            icon="Min"
            tooltip="Min Width"
            get={(s) => {
              const width = s.style.width;
              if (width.type === "fillContainer" && width.min) {
                return {
                  value: width.min,
                };
              }
            }}
            placeholder={() => 0}
            set={(s, value) => {
              const width = s.style.width;
              if (width.type === "fillContainer") {
                s.style.width = {
                  ...width,
                  min: value?.value,
                };
              }
            }}
          />
          <InspectorNumberInput
            icon="Max"
            tooltip="Max Width"
            get={(s) => {
              const width = s.style.width;
              if (width.type === "fillContainer" && width.max) {
                return {
                  value: width.max,
                };
              }
            }}
            set={(s, value) => {
              const width = s.style.width;
              if (width.type === "fillContainer") {
                s.style.width = {
                  ...width,
                  max: value?.value,
                };
              }
            }}
          />
        </>
      )}
    </div>
  );
});

const HeightEdit: React.FC = observer(function HeightEdit() {
  const targets = useContext(InspectorTargetContext);
  const constraint = sameOrMixed(targets.map((s) => s.style.height.type));

  return (
    <div className="grid grid-cols-3 gap-2 items-center">
      <InspectorNumberInput
        icon="H"
        tooltip="Height"
        get={(s) => {
          const height = s.style.height;
          if (height && "value" in height && height.value) {
            return {
              value: height.value,
            };
          }
        }}
        placeholder={(s) => s.computedRect.height}
        set={(s, value) => {
          setSizeConstraintValue(s, "height", value?.value);
        }}
      />
      <InspectorToggleGroup
        get={(s) => s.style.height.type}
        set={(s, value) => {
          setSizeConstraintType(s, "height", value);
        }}
        items={verticalSizeConstraintOptions}
      />
      {constraint === "fillContainer" && (
        <>
          <div />
          <InspectorNumberInput
            icon="Min"
            tooltip="Min Height"
            get={(s) => {
              const height = s.style.height;
              if (height.type === "fillContainer" && height.min) {
                return {
                  value: height.min,
                };
              }
            }}
            placeholder={() => 0}
            set={(s, value) => {
              const height = s.style.height;
              if (height.type === "fillContainer") {
                s.style.height = {
                  ...height,
                  min: value?.value,
                };
              }
            }}
          />
          <InspectorNumberInput
            icon="Max"
            tooltip="Max Height"
            get={(s) => {
              const height = s.style.height;
              if (height.type === "fillContainer" && height.max) {
                return {
                  value: height.max,
                };
              }
            }}
            set={(s, value) => {
              const height = s.style.height;
              if (height.type === "fillContainer") {
                s.style.height = {
                  ...height,
                  max: value?.value,
                };
              }
            }}
          />
        </>
      )}
    </div>
  );
});

const AbsoluteToggle = observer(() => {
  const parentHasLayout = useContext(InspectorTargetContext).some((s) => {
    const parent = s.parent;
    return parent && parent.style.layout !== "none";
  });

  if (parentHasLayout) {
    return (
      <InspectorToggleGroup
        get={(s) => (s.style.absolute ? "absolute" : "relative")}
        items={positionTypeOptions}
        set={(s, value) => {
          if (value === "absolute") {
            s.style.absolute = true;
          } else if (value === "relative") {
            s.style.absolute = false;
          }
        }}
      />
    );
  }

  return (
    <InspectorToggleButton
      icon={pinIcon}
      get={(s) => s.style.absolute}
      set={(s: Selectable, value?: boolean) => {
        s.style.absolute = !!value;
      }}
      tooltip="Keep Absolute on Auto Layout"
    />
  );
});

const PositionEdit = observer(() => {
  return (
    <div className="grid grid-cols-3 gap-2 items-center">
      <AbsoluteToggle />
      <InspectorNumberInput
        icon="T"
        tooltip="Top"
        className="col-start-2 row-start-1"
        get={(s) => {
          const y = s.style.position.y;
          if ("start" in y) {
            return { value: y.start };
          }
        }}
        placeholder={(s) => s.computedOffsetTop}
        set={(s, value) => {
          const y = s.style.position.y;
          const newY: PositionConstraint =
            y.type === "both"
              ? {
                  type: "both",
                  start: value?.value ?? 0,
                  end: y.end,
                }
              : { type: "start", start: value?.value ?? 0 };
          s.style.position = { ...s.style.position, y: newY };
        }}
      />
      <InspectorNumberInput
        icon="R"
        tooltip="Right"
        className="col-start-3 row-start-2"
        placeholder={(s) => s.computedOffsetRight}
        get={(s) => {
          const x = s.style.position.x;
          if ("end" in x) {
            return { value: x.end };
          }
        }}
        set={(s, value) => {
          const x = s.style.position.x;
          const newX: PositionConstraint =
            x.type === "both"
              ? {
                  type: "both",
                  start: x.start,
                  end: value?.value ?? 0,
                }
              : { type: "end", end: value?.value ?? 0 };
          s.style.position = { ...s.style.position, x: newX };
        }}
      />
      <InspectorNumberInput
        icon="B"
        tooltip="Bottom"
        className="col-start-2 row-start-3"
        get={(s) => {
          const y = s.style.position.y;
          if ("end" in y) {
            return { value: y.end };
          }
        }}
        placeholder={(s) => s.computedOffsetBottom}
        set={(s, value) => {
          const y = s.style.position.y;
          const newY: PositionConstraint =
            y.type === "both"
              ? {
                  type: "both",
                  start: y.start,
                  end: value?.value ?? 0,
                }
              : { type: "end", end: value?.value ?? 0 };
          s.style.position = { ...s.style.position, y: newY };
        }}
      />
      <InspectorNumberInput
        icon="L"
        tooltip="Left"
        className="col-start-1 row-start-2"
        placeholder={(s) => s.computedOffsetLeft}
        get={(s) => {
          const x = s.style.position.x;
          if ("start" in x) {
            return { value: x.start };
          }
        }}
        set={(s, value) => {
          const x = s.style.position.x;
          const newX: PositionConstraint =
            x.type === "both"
              ? {
                  type: "both",
                  start: value?.value ?? 0,
                  end: x.end,
                }
              : { type: "start", start: value?.value ?? 0 };
          s.style.position = { ...s.style.position, x: newX };
        }}
      />
      <InspectorAnchorEdit className="col-start-2 row-start-2" />
    </div>
  );
});

const MarginEdit = observer(() => {
  return (
    <div className="grid grid-cols-3 gap-2 items-center">
      <AbsoluteToggle />
      <InspectorNumberInput
        icon={edgeTopIcon}
        tooltip="Margin Top"
        className="col-start-2 row-start-1"
        get={(s) => ({
          value: s.style.marginTop,
        })}
        set={(s, value) => {
          s.style.marginTop = value?.value ?? 0;
        }}
      />
      <InspectorNumberInput
        icon={{
          ...edgeTopIcon,
          rotate: 1,
        }}
        tooltip="Margin Right"
        className="col-start-3 row-start-2"
        get={(s) => ({ value: s.style.marginRight })}
        set={(s, value) => {
          s.style.marginRight = value?.value ?? 0;
        }}
      />
      <InspectorNumberInput
        icon={{
          ...edgeTopIcon,
          rotate: 2,
        }}
        tooltip="Margin Bottom"
        className="col-start-2 row-start-3"
        get={(s) => ({ value: s.style.marginBottom })}
        set={(s, value) => {
          s.style.marginBottom = value?.value ?? 0;
        }}
      />
      <InspectorNumberInput
        icon={{
          ...edgeTopIcon,
          rotate: 3,
        }}
        tooltip="Margin Left"
        className="col-start-1 row-start-2"
        get={(s) => ({ value: s.style.marginLeft })}
        set={(s, value) => {
          s.style.marginLeft = value?.value ?? 0;
        }}
      />
      <div className="col-start-2 row-start-2 bg-macaron-uiBackground w-full rounded aspect-square" />
    </div>
  );
});

export const DimensionsPane: React.FC = observer(function DimensionPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => !s.node.isAbstract
  );
  if (!selectables.length) {
    return null;
  }

  const relative = selectables.some((s) => !s.isAbsolute);

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:straighten-outline"
        text="Dimensions"
      />
      <InspectorTargetContext.Provider value={selectables}>
        {relative ? <MarginEdit /> : <PositionEdit />}
        <div className="flex flex-col gap-2">
          <WidthEdit />
          <HeightEdit />
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

/*
function setPositionStartConstraintValue(
  selectable: Selectable,
  axis: "x" | "y",
  start: number
) {
  const { style } = selectable;
  const parent = selectable.offsetParent;
  if (!parent) {
    // top-level

    const newConstraint = {
      type: "start",
      start: [start, "px"],
    };
    style.position = {
      ...style.position,
      [axis]: newConstraint,
    };
    return;
  }

  const constraint = style.position[axis];
  const rect = selectable.computedRect;
  const parentRect = parent.computedRect;
  const size = rect[axis === "x" ? "width" : "height"];
  const parentSize = parentRect[axis === "x" ? "width" : "height"];

  let newConstraint = constraint;

  switch (constraint.type) {
    case "start": {
      newConstraint = {
        type: "start",
        start: [start, "px"],
      };
      break;
    }
    case "end": {
      newConstraint = {
        type: "end",
        end: [parentSize - start - size, "px"],
      };
      break;
    }
    case "both": {
      newConstraint = {
        type: "both",
        start: [start, "px"],
        end: constraint.end,
      };
      break;
    }
    case "center": {
      const center = start + size / 2;
      const centerOffset = center - parentSize / 2;
      newConstraint = {
        type: "center",
        center: [centerOffset, "px"],
      };
      break;
    }
    case "scale": {
      const startRatio = start / parentSize;
      newConstraint = {
        type: "scale",
        startRatio,
        sizeRatio: constraint.sizeRatio,
      };
      break;
    }
  }

  style.position = {
    ...style.position,
    [axis]: newConstraint,
  };
}
*/

function setPositionStartConstraintType(
  selectable: Selectable,
  axis: "x" | "y",
  type: PositionConstraintType
) {
  const style = selectable.style;
  const constraint = style.position[axis];
  if (constraint.type === type) {
    return;
  }

  const parent = selectable.offsetParent;
  if (!parent) {
    // top-level, only "start" is allowed
    return;
  }

  const rect = selectable.computedRect;
  const parentRect = parent.computedRect;
  const size = rect[axis === "x" ? "width" : "height"];
  const parentSize = parentRect[axis === "x" ? "width" : "height"];
  const start =
    rect[axis === "x" ? "left" : "top"] -
    parentRect[axis === "x" ? "left" : "top"];
  let newConstraint = constraint;

  switch (type) {
    case "start": {
      newConstraint = {
        type: "start",
        start,
      };
      break;
    }
    case "end": {
      newConstraint = {
        type: "end",
        end: parentSize - start - size,
      };
      break;
    }
    case "both": {
      newConstraint = {
        type: "both",
        start: start,
        end: parentSize - start - size,
      };
      break;
    }
  }

  style.position = {
    ...style.position,
    [axis]: newConstraint,
  };
}
