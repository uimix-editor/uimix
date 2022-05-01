import { observer } from "mobx-react-lite";
import React from "react";
import {
  FourEdgeGrid,
  Pane,
  PaneHeading,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { IconRadio } from "@seanchas116/paintkit/src/components/IconRadio";
import relativePositionIcon from "@seanchas116/paintkit/src/icon/RelativePosition";
import staticPositionIcon from "@seanchas116/paintkit/src/icon/StaticPosition";
import absolutePositionIcon from "@seanchas116/paintkit/src/icon/AbsolutePosition";
import marginTopIcon from "@seanchas116/paintkit/src/icon/MarginTop";
import marginRightIcon from "@seanchas116/paintkit/src/icon/MarginRight";
import marginBottomIcon from "@seanchas116/paintkit/src/icon/MarginBottom";
import marginLeftIcon from "@seanchas116/paintkit/src/icon/MarginLeft";
import { DimensionInput } from "@seanchas116/paintkit/src/components/DimensionInput";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { lengthPercentageUnits } from "./Units";

const positionOptions = [
  {
    value: "static",
    icon: staticPositionIcon,
  },
  {
    value: "relative",
    icon: relativePositionIcon,
  },
  {
    value: "absolute",
    icon: absolutePositionIcon,
  },
];

export const PositionPane: React.FC<{
  state: StyleInspectorState;
}> = observer(function PositionPane({ state }) {
  if (state.styles.length === 0) {
    return null;
  }

  return (
    <Pane>
      <PaneHeading>Position</PaneHeading>
      <RowGroup>
        <IconRadio
          options={positionOptions}
          value={state.props.position.value}
          placeholder={state.props.position.computed}
          unsettable
          onChange={state.props.position.onChange}
        />
        <FourEdgeGrid>
          <DimensionInput
            label="T"
            title="top"
            placeholder={state.props.top.computed}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            value={state.props.top.value}
            onChange={state.props.top.onChange}
          />
          <DimensionInput
            label="R"
            title="right"
            placeholder={state.props.right.computed}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            value={state.props.right.value}
            onChange={state.props.right.onChange}
          />
          <DimensionInput
            label="B"
            title="bottom"
            placeholder={state.props.bottom.computed}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            value={state.props.bottom.value}
            onChange={state.props.bottom.onChange}
          />
          <DimensionInput
            label="L"
            title="left"
            placeholder={state.props.left.computed}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            value={state.props.left.value}
            onChange={state.props.left.onChange}
          />
        </FourEdgeGrid>
        <FourEdgeGrid>
          <DimensionInput
            icon={marginTopIcon}
            title="margin-top"
            placeholder={state.props.marginTop.computed}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            value={state.props.marginTop.value}
            onChange={state.props.marginTop.onChange}
          />
          <DimensionInput
            icon={marginRightIcon}
            title="margin-right"
            placeholder={state.props.marginRight.computed}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            value={state.props.marginRight.value}
            onChange={state.props.marginRight.onChange}
          />
          <DimensionInput
            icon={marginBottomIcon}
            title="margin-bottom"
            placeholder={state.props.marginBottom.computed}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            value={state.props.marginBottom.value}
            onChange={state.props.marginBottom.onChange}
          />
          <DimensionInput
            icon={marginLeftIcon}
            title="margin-left"
            placeholder={state.props.marginLeft.computed}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            value={state.props.marginLeft.value}
            onChange={state.props.marginLeft.onChange}
          />
        </FourEdgeGrid>
      </RowGroup>
    </Pane>
  );
});
