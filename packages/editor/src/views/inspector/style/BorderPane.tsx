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
import icon_line_weight from "@iconify-icons/ic/outline-line-weight";
import eachEdgeIcon from "@seanchas116/design-icons/json/separate-edges.json";
import edgeTopIcon from "@seanchas116/design-icons/json/edge-top.json";
import edgeRightIcon from "@seanchas116/design-icons/json/edge-right.json";
import edgeBottomIcon from "@seanchas116/design-icons/json/edge-bottom.json";
import edgeLeftIcon from "@seanchas116/design-icons/json/edge-left.json";
import { SeparableInput } from "../../../components/SeparableInput";
import { useContext } from "react";

function BorderWidthEdit() {
  const selectables = useContext(InspectorTargetContext);
  const top = sameOrMixed(selectables.map((s) => s.style.borderTopWidth[0]));
  const right = sameOrMixed(
    selectables.map((s) => s.style.borderRightWidth[0])
  );
  const bottom = sameOrMixed(
    selectables.map((s) => s.style.borderBottomWidth[0])
  );
  const left = sameOrMixed(selectables.map((s) => s.style.borderLeftWidth[0]));

  return (
    <SeparableInput
      title="Border Width"
      values={{
        top: String(top),
        right: String(right),
        bottom: String(bottom),
        left: String(left),
      }}
      edgeIcons={{
        all: icon_line_weight,
        top: edgeTopIcon,
        right: edgeRightIcon,
        bottom: edgeBottomIcon,
        left: edgeLeftIcon,
      }}
      toggleIcon={eachEdgeIcon}
      onChange={(edge, value) => {
        let numValue = Number.parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
          numValue = 0;
        }

        for (const selectable of selectables) {
          switch (edge) {
            case "top":
              selectable.style.borderTopWidth = [numValue, "px"];
              break;
            case "right":
              selectable.style.borderRightWidth = [numValue, "px"];
              break;
            case "bottom":
              selectable.style.borderBottomWidth = [numValue, "px"];
              break;
            case "left":
              selectable.style.borderLeftWidth = [numValue, "px"];
              break;
            case "all":
              selectable.style.borderTopWidth = [numValue, "px"];
              selectable.style.borderRightWidth = [numValue, "px"];
              selectable.style.borderBottomWidth = [numValue, "px"];
              selectable.style.borderLeftWidth = [numValue, "px"];
              break;
          }
        }

        projectState.undoManager.stopCapturing();

        return true;
      }}
    />
  );
}

export const BorderPane: React.FC = observer(function BorderPane() {
  const selectables = projectState.selectedSelectables.filter(
    (s) => !s.node.isAbstract
  );
  const border = sameOrMixed(selectables.map((s) => s.style.border));
  const hasBorder = border && border !== Mixed;

  const onChangeBorder = action((border: Color | undefined) => {
    for (const selectable of selectables) {
      const adding = border && !selectable.style.border;
      selectable.style.border = border
        ? { type: "solid", hex: border.toHex() }
        : null;
      if (adding) {
        selectable.style.borderTopWidth = [1, "px"];
        selectable.style.borderRightWidth = [1, "px"];
        selectable.style.borderBottomWidth = [1, "px"];
        selectable.style.borderLeftWidth = [1, "px"];
      }
      if (!border) {
        selectable.style.borderTopWidth = [0, "px"];
        selectable.style.borderRightWidth = [0, "px"];
        selectable.style.borderBottomWidth = [0, "px"];
        selectable.style.borderLeftWidth = [0, "px"];
      }
    }
  });
  const onChangeEndBorder = action(() => {
    projectState.undoManager.stopCapturing();
  });

  if (!selectables.length) {
    return null;
  }

  return (
    <InspectorPane>
      <InspectorHeading
        icon="material-symbols:border-color-outline"
        text="Border"
        dimmed={!hasBorder}
        buttons={
          hasBorder ? (
            <IconButton
              icon={removeIcon}
              onClick={() => {
                onChangeBorder(undefined);
              }}
            />
          ) : (
            <IconButton
              icon={addIcon}
              onClick={() => {
                onChangeBorder(Color.from("black"));
              }}
            />
          )
        }
      />
      {border === Mixed ? (
        <div className="text-macaron-disabledText">Mixed</div>
      ) : border ? (
        <InspectorTargetContext.Provider value={selectables}>
          <div className="flex flex-col gap-2">
            <ColorInput
              value={Color.from(border.hex) ?? Color.black}
              onChange={onChangeBorder}
              onChangeEnd={onChangeEndBorder}
            />
            <BorderWidthEdit />
          </div>
        </InspectorTargetContext.Provider>
      ) : null}
    </InspectorPane>
  );
});
