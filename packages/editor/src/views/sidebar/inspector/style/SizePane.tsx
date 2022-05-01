import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  Row111,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { DimensionInput } from "@seanchas116/paintkit/src/components/DimensionInput";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { lengthPercentageUnits } from "./Units";

export const SizePane: React.FC<{
  state: StyleInspectorState;
}> = observer(function SizePane({ state }) {
  if (state.styles.length === 0) {
    return null;
  }

  return (
    <Pane>
      <PaneHeading>Size</PaneHeading>
      <RowGroup>
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
      </RowGroup>
    </Pane>
  );
});
