import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  Row11,
  Row111,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import {
  IconButton,
  MoreButton,
} from "@seanchas116/paintkit/src/components/IconButton";
import separateCornersIcon from "@seanchas116/paintkit/src/icon/SeparateCorners";
import radiusIcon from "@seanchas116/paintkit/src/icon/Radius";
import Tippy from "@tippyjs/react";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { lengthPercentageUnits } from "./Units";
import { StyleDimensionInput } from "./Components";

export const SizePane: React.FC<{
  state: StyleInspectorState;
}> = observer(function SizePane({ state }) {
  const separateRadiusesButton = (
    <IconButton
      style={{
        justifySelf: "flex-end",
      }}
      icon={separateCornersIcon}
      pressed={state.showsSeparateRadiuses}
      onClick={state.onToggleShowSeparateRadiuses}
    />
  );

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Size</PaneHeading>
        <Tippy content="Show details">
          <div>
            <MoreButton
              pressed={state.showsSizeDetails}
              onClick={state.onToggleShowSizeDetails}
            />
          </div>
        </Tippy>
      </PaneHeadingRow>
      <RowGroup>
        {state.showsSizeDetails ? (
          <>
            <Row111>
              <StyleDimensionInput
                icon="W"
                units={lengthPercentageUnits}
                keywords={["auto"]}
                property={state.props.width}
              />
              <StyleDimensionInput
                icon=">"
                units={lengthPercentageUnits}
                keywords={["auto"]}
                property={state.props.minWidth}
              />
              <StyleDimensionInput
                icon="<"
                units={lengthPercentageUnits}
                keywords={["auto"]}
                property={state.props.maxWidth}
              />
            </Row111>
            <Row111>
              <StyleDimensionInput
                icon="H"
                units={lengthPercentageUnits}
                keywords={["auto"]}
                property={state.props.height}
              />
              <StyleDimensionInput
                icon=">"
                units={lengthPercentageUnits}
                keywords={["auto"]}
                property={state.props.minHeight}
              />
              <StyleDimensionInput
                icon="<"
                units={lengthPercentageUnits}
                keywords={["auto"]}
                property={state.props.maxHeight}
              />
            </Row111>
          </>
        ) : (
          <Row11>
            <StyleDimensionInput
              icon="W"
              units={lengthPercentageUnits}
              keywords={["auto"]}
              property={state.props.width}
            />
            <StyleDimensionInput
              icon="H"
              units={lengthPercentageUnits}
              keywords={["auto"]}
              property={state.props.height}
            />
          </Row11>
        )}
        {state.showsSeparateRadiuses ? (
          <>
            <Row111>
              <StyleDimensionInput
                icon={radiusIcon}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                property={state.props.borderTopLeftRadius}
              />
              <StyleDimensionInput
                icon={{ ...radiusIcon, rotate: 1 }}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                property={state.props.borderTopRightRadius}
              />
              {separateRadiusesButton}
            </Row111>
            <Row111>
              <StyleDimensionInput
                icon={{ ...radiusIcon, rotate: 3 }}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                property={state.props.borderBottomLeftRadius}
              />
              <StyleDimensionInput
                icon={{ ...radiusIcon, rotate: 2 }}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                property={state.props.borderBottomRightRadius}
              />
            </Row111>
          </>
        ) : (
          <Row111>
            <StyleDimensionInput
              icon={radiusIcon}
              units={lengthPercentageUnits}
              keywords={["auto"]}
              property={state.props.borderRadius}
            />
            <div />
            {separateRadiusesButton}
          </Row111>
        )}
      </RowGroup>
    </Pane>
  );
});
