import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  Row111,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { observer } from "mobx-react-lite";
import React from "react";
import unfoldMoreIcon from "@iconify-icons/ic/outline-unfold-more";
import unfoldLessIcon from "@iconify-icons/ic/outline-unfold-less";
import fullscreenIcon from "@iconify-icons/ic/outline-fullscreen";
import alignVerticalTopIcon from "@iconify-icons/ic/outline-align-vertical-top";
import alignVerticalCenterIcon from "@iconify-icons/ic/outline-align-vertical-center";
import alignVerticalBottomIcon from "@iconify-icons/ic/outline-align-vertical-bottom";
import alignStretchIcon from "@seanchas116/paintkit/src/icon/AlignStretch";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { StyleDimensionInput, StyleIconRadio, StyleInput } from "./Components";
import { lengthPercentageUnits } from "./Units";

const alignSelfOptionsRow = [
  {
    value: "stretch",
    icon: alignStretchIcon,
  },
  {
    value: "flex-start",
    icon: alignVerticalTopIcon,
  },
  {
    value: "center",
    icon: alignVerticalCenterIcon,
  },
  {
    value: "flex-end",
    icon: alignVerticalBottomIcon,
  },
];

const alignSelfOptionsColumn = alignSelfOptionsRow.map((option) => ({
  value: option.value,
  icon: { ...option.icon, rotate: (option.icon.rotate ?? 0) - 1 },
}));

export const FlexItemPane: React.FC<{
  state: StyleInspectorState;
}> = observer(function LayoutPane({ state }) {
  const { computedParentDisplay, computedParentFlexDirection } = state;

  if (
    typeof computedParentDisplay !== "string" ||
    !computedParentDisplay.includes("flex")
  ) {
    return null;
  }

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Flex Item</PaneHeading>
      </PaneHeadingRow>
      <RowGroup>
        <StyleIconRadio
          options={
            computedParentFlexDirection === "column"
              ? alignSelfOptionsColumn
              : alignSelfOptionsRow
          }
          property={state.props.alignSelf}
        />
        <Row111>
          <StyleInput icon={unfoldMoreIcon} property={state.props.flexGrow} />
          <StyleInput icon={unfoldLessIcon} property={state.props.flexShrink} />
          <StyleDimensionInput
            icon={fullscreenIcon}
            units={lengthPercentageUnits}
            property={state.props.flexBasis}
          />
        </Row111>
      </RowGroup>
    </Pane>
  );
});
