import { observer } from "mobx-react-lite";
import React from "react";
import {
  FourEdgeGrid,
  Pane,
  PaneHeading,
  PaneHeadingRow,
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
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { lengthPercentageUnits } from "./Units";
import { StyleDimensionInput } from "./Util";

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
      <PaneHeadingRow>
        <PaneHeading>Position</PaneHeading>
      </PaneHeadingRow>
      <RowGroup>
        <IconRadio
          options={positionOptions}
          value={state.props.position.value}
          placeholder={state.props.position.computed}
          unsettable
          onChange={state.props.position.onChange}
        />
        {state.props.position.computed !== "static" && (
          <FourEdgeGrid>
            <StyleDimensionInput
              label="T"
              units={lengthPercentageUnits}
              keywords={["auto"]}
              property={state.props.top}
            />
            <StyleDimensionInput
              label="R"
              units={lengthPercentageUnits}
              keywords={["auto"]}
              property={state.props.right}
            />
            <StyleDimensionInput
              label="B"
              units={lengthPercentageUnits}
              keywords={["auto"]}
              property={state.props.bottom}
            />
            <StyleDimensionInput
              label="L"
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
