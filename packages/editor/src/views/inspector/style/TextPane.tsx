import { observer } from "mobx-react-lite";
import formatSizeIcon from "@iconify-icons/ic/format-size";
import formatLineSpacingIcon from "@iconify-icons/ic/format-line-spacing";
import formatAlignLeftIcon from "@iconify-icons/ic/format-align-left";
import formatAlignCenterIcon from "@iconify-icons/ic/format-align-center";
import formatAlignRightIcon from "@iconify-icons/ic/format-align-right";
import formatAlignJustifyIcon from "@iconify-icons/ic/format-align-justify";
import verticalAlignTopIcon from "@iconify-icons/ic/vertical-align-top";
import verticalAlignCenterIcon from "@iconify-icons/ic/vertical-align-center";
import verticalAlignBottomIcon from "@iconify-icons/ic/vertical-align-bottom";
import spaceBarIcon from "@iconify-icons/ic/space-bar";
import { InspectorHeading } from "../components/InspectorHeading";
import { InspectorNumberInput } from "./inputs/InspectorNumberInput";
import { InspectorPane } from "../components/InspectorPane";
import { InspectorToggleGroup } from "./inputs/InspectorToggleGroup";
import { ToggleGroupItem } from "@uimix/foundation/src/components";
import * as Data from "@uimix/model/src/data/v1";
import { InspectorTargetContext } from "../components/InspectorTargetContext";
import { projectState } from "../../../state/ProjectState";
import { InspectorComboBox } from "./inputs/InspectorComboBox";
import googleFonts from "@uimix/foundation/src/fonts/GoogleFonts.json";

const googleFontOptions = googleFonts.items.map((item) => ({
  value: item.family,
  text: item.family,
}));

const textAlignOptions: ToggleGroupItem<Data.TextHorizontalAlign>[] = [
  {
    value: "start",
    icon: formatAlignLeftIcon,
  },
  {
    value: "center",
    icon: formatAlignCenterIcon,
  },
  {
    value: "end",
    icon: formatAlignRightIcon,
  },
  {
    value: "justify",
    icon: formatAlignJustifyIcon,
  },
];

const verticalAlignOptions: ToggleGroupItem<Data.TextVerticalAlign>[] = [
  {
    value: "start",
    icon: verticalAlignTopIcon,
  },
  {
    value: "center",
    icon: verticalAlignCenterIcon,
  },
  {
    value: "end",
    icon: verticalAlignBottomIcon,
  },
];

export const TextPane: React.FC = observer(function TextPane() {
  const textSelectables = projectState.selectedSelectables.filter(
    (s) => s.node.type === "text"
  );

  if (textSelectables.length === 0) {
    return null;
  }

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:font-download-outline-rounded"
        text="Text"
      />
      <InspectorTargetContext.Provider value={textSelectables}>
        <div className="flex flex-col gap-2">
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
                  value: value[0],
                  unit: value[1],
                };
              }}
              allowedUnits={["%"]}
              set={(s, value) => {
                s.style.lineHeight =
                  value === undefined
                    ? null
                    : value.unit === "%"
                    ? [value.value, "%"]
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
                  value: value[0],
                  unit: value[1],
                };
              }}
              allowedUnits={["%"]}
              set={(s, value) => {
                s.style.letterSpacing =
                  value === undefined
                    ? 0
                    : value.unit === "%"
                    ? [value.value, "%"]
                    : value.value;
              }}
            />
          </div>
          <InspectorToggleGroup
            items={textAlignOptions}
            get={(s) => s.style.textHorizontalAlign}
            set={(s, value) => {
              s.style.textHorizontalAlign = value ?? "start";
            }}
          />
          <InspectorToggleGroup
            items={verticalAlignOptions}
            get={(s) => s.style.textVerticalAlign}
            set={(s, value) => {
              s.style.textVerticalAlign = value ?? "start";
            }}
          />
        </div>
      </InspectorTargetContext.Provider>
    </InspectorPane>
  );
});
