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
import { Input } from "@seanchas116/paintkit/src/components/Input";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";

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
          return (
            <TopLabelArea>
              <Label>{cssVariable}</Label>
              <Input />
            </TopLabelArea>
          );
        })}
      </RowGroup>
    </Pane>
  );
});
