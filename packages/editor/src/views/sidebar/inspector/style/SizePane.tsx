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
import { DimensionInput } from "@seanchas116/paintkit/src/components/DimensionInput";
import {
  IconButton,
  MoreButton,
} from "@seanchas116/paintkit/src/components/IconButton";
import separateCornersIcon from "@seanchas116/paintkit/src/icon/SeparateCorners";
import radiusIcon from "@seanchas116/paintkit/src/icon/Radius";
import Tippy from "@tippyjs/react";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { lengthPercentageUnits } from "./Units";

export const SizePane: React.FC<{
  state: StyleInspectorState;
}> = observer(function SizePane({ state }) {
  if (state.styles.length === 0) {
    return null;
  }

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
              <DimensionInput
                label="W"
                title="width"
                placeholder={state.props.width.computed}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                value={state.props.width.value}
                onChange={state.props.width.onChange}
              />
              <DimensionInput
                label=">"
                title="min-width"
                placeholder={state.props.minWidth.computed}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                value={state.props.minWidth.value}
                onChange={state.props.minWidth.onChange}
              />
              <DimensionInput
                label="<"
                title="max-width"
                placeholder={state.props.maxWidth.computed}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                value={state.props.maxWidth.value}
                onChange={state.props.maxWidth.onChange}
              />
            </Row111>
            <Row111>
              <DimensionInput
                label="H"
                title="height"
                placeholder={state.props.height.computed}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                value={state.props.height.value}
                onChange={state.props.height.onChange}
              />
              <DimensionInput
                label=">"
                title="min-height"
                placeholder={state.props.minHeight.computed}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                value={state.props.minHeight.value}
                onChange={state.props.minHeight.onChange}
              />
              <DimensionInput
                label="<"
                title="max-height"
                placeholder={state.props.maxHeight.computed}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                value={state.props.maxHeight.value}
                onChange={state.props.maxHeight.onChange}
              />
            </Row111>
          </>
        ) : (
          <Row11>
            <DimensionInput
              label="W"
              title="width"
              placeholder={state.props.width.computed}
              units={lengthPercentageUnits}
              keywords={["auto"]}
              value={state.props.width.value}
              onChange={state.props.width.onChange}
            />
            <DimensionInput
              label="H"
              title="height"
              placeholder={state.props.height.computed}
              units={lengthPercentageUnits}
              keywords={["auto"]}
              value={state.props.height.value}
              onChange={state.props.height.onChange}
            />
          </Row11>
        )}
      </RowGroup>
      <RowGroup>
        {state.showsSeparateRadiuses ? (
          <>
            <Row111>
              <DimensionInput
                icon={radiusIcon}
                title="border-top-left-radius"
                placeholder={state.props.borderTopLeftRadius.computed}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                value={state.props.borderTopLeftRadius.value}
                onChange={state.props.borderTopLeftRadius.onChange}
              />
              <DimensionInput
                icon={{ ...radiusIcon, rotate: 1 }}
                title="border-top-right-radius"
                placeholder={state.props.borderTopRightRadius.computed}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                value={state.props.borderTopRightRadius.value}
                onChange={state.props.borderTopRightRadius.onChange}
              />
              {separateRadiusesButton}
            </Row111>
            <Row111>
              <DimensionInput
                icon={{ ...radiusIcon, rotate: 3 }}
                title="border-bottom-left-radius"
                placeholder={state.props.borderBottomLeftRadius.computed}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                value={state.props.borderBottomLeftRadius.value}
                onChange={state.props.borderBottomLeftRadius.onChange}
              />
              <DimensionInput
                icon={{ ...radiusIcon, rotate: 2 }}
                title="border-bottom-right-radius"
                placeholder={state.props.borderBottomRightRadius.computed}
                units={lengthPercentageUnits}
                keywords={["auto"]}
                value={state.props.borderBottomRightRadius.value}
                onChange={state.props.borderBottomRightRadius.onChange}
              />
            </Row111>
          </>
        ) : (
          <Row111>
            <DimensionInput
              icon={radiusIcon}
              title="border-radius"
              placeholder={state.props.borderRadius.computed}
              units={lengthPercentageUnits}
              keywords={["auto"]}
              value={state.props.borderRadius.value}
              onChange={state.props.borderRadius.onChange}
            />
            <div />
            {separateRadiusesButton}
          </Row111>
        )}
      </RowGroup>
    </Pane>
  );
});
