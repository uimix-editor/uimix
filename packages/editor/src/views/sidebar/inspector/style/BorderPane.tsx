import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  Row12,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import lineWeightIcon from "@iconify-icons/ic/outline-line-weight";
import closeIcon from "@iconify-icons/ic/outline-close";
import solidLineIcon from "@seanchas116/paintkit/src/icon/SolidLine";
import dottedLineIcon from "@seanchas116/paintkit/src/icon/DottedLine";
import dashedLineIcon from "@seanchas116/paintkit/src/icon/DashedLine";
import edgeAllIcon from "@seanchas116/paintkit/src/icon/EdgeAll";
import edgeTopIcon from "@seanchas116/paintkit/src/icon/EdgeTop";
import edgeBottomIcon from "@seanchas116/paintkit/src/icon/EdgeBottom";
import edgeLeftIcon from "@seanchas116/paintkit/src/icon/EdgeLeft";
import edgeRightIcon from "@seanchas116/paintkit/src/icon/EdgeRight";
import { IconButton } from "@seanchas116/paintkit/src/components/IconButton";
import Tippy from "@tippyjs/react";
import {
  StyleInspectorState,
  StylePropertyState,
} from "../../../../state/StyleInspectorState";
import { lengthPercentageUnits } from "./Units";
import {
  StyleColorInput,
  StyleDimensionInput,
  StyleIconRadio,
} from "./Components";

const borderStyleOptions = [
  {
    value: "none",
    icon: closeIcon,
  },
  {
    value: "solid",
    icon: solidLineIcon,
  },
  {
    value: "dotted",
    icon: dottedLineIcon,
  },
  {
    value: "dashed",
    icon: dashedLineIcon,
  },
];

export const BorderPane: React.FC<{
  state: StyleInspectorState;
}> = observer(function BorderPane({ state }) {
  let color: StylePropertyState;
  let width: StylePropertyState;
  let style: StylePropertyState;

  switch (state.borderEdgeMode) {
    case "all":
      color = state.props.borderColor;
      width = state.props.borderWidth;
      style = state.props.borderStyle;
      break;
    case "top":
      color = state.props.borderTopColor;
      width = state.props.borderTopWidth;
      style = state.props.borderTopStyle;
      break;
    case "bottom":
      color = state.props.borderBottomColor;
      width = state.props.borderBottomWidth;
      style = state.props.borderBottomStyle;
      break;
    case "left":
      color = state.props.borderLeftColor;
      width = state.props.borderLeftWidth;
      style = state.props.borderLeftStyle;
      break;
    case "right":
      color = state.props.borderRightColor;
      width = state.props.borderRightWidth;
      style = state.props.borderRightStyle;
  }

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Border</PaneHeading>
        <Tippy content="All">
          <IconButton
            icon={edgeAllIcon}
            pressed={state.borderEdgeMode === "all"}
            onClick={state.setBorderEdgeModeToAll}
          />
        </Tippy>
        <Tippy content="Top">
          <IconButton
            icon={edgeTopIcon}
            pressed={state.borderEdgeMode === "top"}
            onClick={state.setBorderEdgeModeToTop}
          />
        </Tippy>
        <Tippy content="Right">
          <IconButton
            icon={edgeRightIcon}
            pressed={state.borderEdgeMode === "right"}
            onClick={state.setBorderEdgeModeToRight}
          />
        </Tippy>
        <Tippy content="Bottom">
          <IconButton
            icon={edgeBottomIcon}
            pressed={state.borderEdgeMode === "bottom"}
            onClick={state.setBorderEdgeModeToBottom}
          />
        </Tippy>
        <Tippy content="Left">
          <IconButton
            icon={edgeLeftIcon}
            pressed={state.borderEdgeMode === "left"}
            onClick={state.setBorderEdgeModeToLeft}
          />
        </Tippy>
      </PaneHeadingRow>
      <RowGroup>
        <Row12>
          <StyleIconRadio options={borderStyleOptions} property={style} />
          {style.computed !== "none" && (
            <StyleDimensionInput
              icon={lineWeightIcon}
              units={lengthPercentageUnits}
              property={width}
            />
          )}
        </Row12>
        {style.computed !== "none" && <StyleColorInput property={color} />}
      </RowGroup>
    </Pane>
  );
});
