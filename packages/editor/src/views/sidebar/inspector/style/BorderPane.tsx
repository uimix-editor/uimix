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
import { DimensionInput } from "@seanchas116/paintkit/src/components/DimensionInput";
import { IconRadio } from "@seanchas116/paintkit/src/components/IconRadio";
import { IconButton } from "@seanchas116/paintkit/src/components/IconButton";
import { kebabCase } from "lodash-es";
import {
  StyleInspectorState,
  StylePropertyState,
} from "../../../../state/StyleInspectorState";
import { CSSColorInput } from "../CSSColorInput";
import { lengthPercentageUnits } from "./Units";

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
  if (state.styles.length === 0) {
    return null;
  }

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
        <IconButton
          icon={edgeAllIcon}
          pressed={state.borderEdgeMode === "all"}
          onClick={state.setBorderEdgeModeToAll}
        />
        <IconButton
          icon={edgeTopIcon}
          pressed={state.borderEdgeMode === "top"}
          onClick={state.setBorderEdgeModeToTop}
        />
        <IconButton
          icon={edgeRightIcon}
          pressed={state.borderEdgeMode === "right"}
          onClick={state.setBorderEdgeModeToRight}
        />
        <IconButton
          icon={edgeBottomIcon}
          pressed={state.borderEdgeMode === "bottom"}
          onClick={state.setBorderEdgeModeToBottom}
        />
        <IconButton
          icon={edgeLeftIcon}
          pressed={state.borderEdgeMode === "left"}
          onClick={state.setBorderEdgeModeToLeft}
        />
      </PaneHeadingRow>
      <RowGroup>
        <Row12>
          <IconRadio
            options={borderStyleOptions}
            value={style.value}
            placeholder={style.computed}
            unsettable
            onChange={style.onChange}
          />
          {style.computed !== "none" && (
            <DimensionInput
              icon={lineWeightIcon}
              title={kebabCase(width.key)}
              units={lengthPercentageUnits}
              placeholder={width.computed}
              value={width.value}
              onChange={width.onChange}
            />
          )}
        </Row12>
        {style.computed !== "none" && (
          <CSSColorInput
            value={color.value}
            title={kebabCase(color.key)}
            placeholder={color.computed}
            onChange={color.onChangeWithoutCommit}
            onChangeEnd={color.onChange}
          />
        )}
      </RowGroup>
    </Pane>
  );
});
