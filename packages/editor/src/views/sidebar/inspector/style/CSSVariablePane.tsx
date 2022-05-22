import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  RowGroup,
  TopLabelArea,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { Label } from "@seanchas116/paintkit/src/components/Label";
import { CSSColorInput } from "@seanchas116/paintkit/src/components/css/CSSColorInput";
import {
  StyleCustomPropertyState,
  StyleInspectorState,
} from "../../../../state/StyleInspectorState";

export const CSSVariablePane: React.FC<{
  state: StyleInspectorState;
}> = observer(function CSSVariablePane({ state }) {
  const { customElementMetadata } = state;
  if (!customElementMetadata) {
    return null;
  }

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>CSS Variables</PaneHeading>
      </PaneHeadingRow>
      <RowGroup>
        {customElementMetadata.cssVariables.map((cssVariable) => {
          const propState = new StyleCustomPropertyState(state, cssVariable);

          return (
            <TopLabelArea key={cssVariable}>
              <Label>{cssVariable}</Label>
              <CSSColorInput
                value={propState.value}
                onChange={propState.onChangeWithoutCommit}
                onChangeEnd={propState.onCommit}
              />
            </TopLabelArea>
          );
        })}
      </RowGroup>
    </Pane>
  );
});
