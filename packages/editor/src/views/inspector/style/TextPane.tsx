import { observer } from "mobx-react-lite";
import formatSizeIcon from "@iconify-icons/ic/format-size";
import formatLineSpacingIcon from "@iconify-icons/ic/format-line-spacing";
import spaceBarIcon from "@iconify-icons/ic/space-bar";
import edgeTopIcon from "@seanchas116/design-icons/json/edge-top.json";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorNumberInput } from "./inputs/InspectorNumberInput";
import { InspectorPane } from "../components/InspectorPane";
import { AlignmentEdit } from "@uimix/foundation/src/components";
import * as Data from "@uimix/model/src/data/v1";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { projectState } from "../../../state/ProjectState";
import { InspectorComboBox } from "./inputs/InspectorComboBox";
import googleFonts from "@uimix/foundation/src/fonts/GoogleFonts.json";
import { ColorInput } from "../components/ColorInput";
import { sameOrMixed, sameOrNone } from "@uimix/foundation/src/utils/Mixed";
import { ColorRef } from "@uimix/model/src/models";
import { action } from "mobx";

const googleFontOptions = googleFonts.items.map((item) => ({
  value: item.family,
  text: item.family,
}));

export const TextPane: React.FC = observer(function TextPane() {
  const textSelectables = projectState.selectedSelectables.filter(
    (s) => s.node.type === "text"
  );

  if (textSelectables.length === 0) {
    return null;
  }

  // TODO: Add InspectorColorInput?
  const color = sameOrNone(textSelectables.map((s) => s.style.color));

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:font-download-outline-rounded"
        text="Text"
      />
      <InspectorTargetContext.Provider value={textSelectables}>
        <div className="flex flex-col gap-2">
          <ColorInput
            value={
              color != null
                ? ColorRef.fromJSON(projectState.project, color)
                : undefined
            }
            onChange={action((color) => {
              for (const selectable of textSelectables) {
                selectable.style.color = color?.toJSON() ?? "#000000";
              }
            })}
            onChangeEnd={action(() => {
              projectState.undoManager.stopCapturing();
            })}
          />
          <InspectorComboBox
            get={(s) => s.style.fontFamily}
            set={(s, value) => {
              s.style.fontFamily = value ?? "Inter";
            }}
            options={googleFontOptions}
          />
          <div className="grid grid-cols-2 gap-2">
            <InspectorNumberInput
              get={(s) => ({ value: s.style.fontWeight })}
              set={(s, value) => {
                s.style.fontWeight = value?.value ?? 400;
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 items-center">
            <InspectorNumberInput
              icon={formatSizeIcon}
              get={(s) => ({ value: s.style.fontSize })}
              set={(s, value) => {
                s.style.fontSize = value?.value ?? 16;
              }}
            />
            <InspectorNumberInput
              icon={formatLineSpacingIcon}
              get={(s) => {
                const value = s.style.lineHeight;
                if (value === null) {
                  return;
                }
                if (typeof value === "number") {
                  return {
                    value: value,
                  };
                }
                return {
                  value: Number.parseFloat(value),
                  unit: "%",
                };
              }}
              allowedUnits={["%"]}
              set={(s, value) => {
                s.style.lineHeight =
                  value === undefined
                    ? null
                    : value.unit === "%"
                    ? `${value.value}%`
                    : value.value;
              }}
            />
            <InspectorNumberInput
              icon={spaceBarIcon}
              get={(s) => {
                const value = s.style.letterSpacing;
                if (typeof value === "number") {
                  return {
                    value: value,
                  };
                }
                return {
                  value: Number.parseFloat(value),
                  unit: "%",
                };
              }}
              allowedUnits={["%"]}
              set={(s, value) => {
                s.style.letterSpacing =
                  value === undefined
                    ? 0
                    : value.unit === "%"
                    ? `${value.value}%`
                    : value.value;
              }}
            />
          </div>
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
            direction="y"
            className="col-start-2 row-start-2"
          />
        </div>
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});

const StackAlignmentEdit = observer(function StackAlignmentEdit({
  direction,
  className,
}: {
  direction: Data.StackDirection;
  className?: string;
}) {
  const selectables = projectState.selectedSelectables;
  const align = sameOrMixed(
    selectables.map((s) => s.style.textHorizontalAlign)
  );
  const justify = sameOrMixed(
    selectables.map((s) => s.style.textVerticalAlign)
  );

  return (
    <AlignmentEdit
      className={className}
      direction={direction}
      align={
        typeof align === "string"
          ? align === "justify"
            ? "start"
            : align
          : undefined
      }
      justify={typeof justify === "string" ? justify : undefined}
      onChange={action((align, justify) => {
        for (const selectable of selectables) {
          selectable.style.textHorizontalAlign = align ?? "start";
          selectable.style.textVerticalAlign =
            justify && justify !== "spaceBetween" ? justify : "start";
        }
        projectState.undoManager.stopCapturing();
      })}
    />
  );
});
