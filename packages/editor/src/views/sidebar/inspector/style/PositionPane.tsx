import { observer } from "mobx-react-lite";
import React from "react";
import {
  FourEdgeGrid,
  Pane,
  PaneHeading,
  PaneHeadingRow,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import relativePositionIcon from "@seanchas116/paintkit/src/icon/RelativePosition";
import staticPositionIcon from "@seanchas116/paintkit/src/icon/StaticPosition";
import absolutePositionIcon from "@seanchas116/paintkit/src/icon/AbsolutePosition";
import marginTopIcon from "@seanchas116/paintkit/src/icon/MarginTop";
import marginRightIcon from "@seanchas116/paintkit/src/icon/MarginRight";
import marginBottomIcon from "@seanchas116/paintkit/src/icon/MarginBottom";
import marginLeftIcon from "@seanchas116/paintkit/src/icon/MarginLeft";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { lengthPercentageUnits } from "./Units";
import { StyleDimensionInput, StyleIconRadio } from "./Components";

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
  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Position</PaneHeading>
      </PaneHeadingRow>
      <RowGroup>
        <StyleIconRadio
          options={positionOptions}
          property={state.props.position}
        />
        {state.props.position.computed !== "static" && (
          <FourEdgeGrid>
            <StyleDimensionInput
              icon="T"
              units={lengthPercentageUnits}
              keywords={["auto"]}
              property={state.props.top}
            />
            <StyleDimensionInput
              icon="R"
              units={lengthPercentageUnits}
              keywords={["auto"]}
              property={state.props.right}
            />
            <StyleDimensionInput
              icon="B"
              units={lengthPercentageUnits}
              keywords={["auto"]}
              property={state.props.bottom}
            />
            <StyleDimensionInput
              icon="L"
              units={lengthPercentageUnits}
              keywords={["auto"]}
              property={state.props.left}
            />
          </FourEdgeGrid>
        )}
        <FourEdgeGrid>
          <StyleDimensionInput
            icon={marginTopIcon}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            property={state.props.marginTop}
          />
          <StyleDimensionInput
            icon={marginRightIcon}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            property={state.props.marginRight}
          />
          <StyleDimensionInput
            icon={marginBottomIcon}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            property={state.props.marginBottom}
          />
          <StyleDimensionInput
            icon={marginLeftIcon}
            units={lengthPercentageUnits}
            keywords={["auto"]}
            property={state.props.marginLeft}
          />
        </FourEdgeGrid>
      </RowGroup>
    </Pane>
  );
});
