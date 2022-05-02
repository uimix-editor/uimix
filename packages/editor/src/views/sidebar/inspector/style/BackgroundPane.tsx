import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { CSSColorInput } from "../CSSColorInput";

export const BackgroundPane: React.FC<{
  state: StyleInspectorState;
}> = observer(function BackgroundPane({ state }) {
  if (state.styles.length === 0) {
    return null;
  }

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Background</PaneHeading>
      </PaneHeadingRow>
      <RowGroup>
        <CSSColorInput
          value={state.props.backgroundColor.value}
          title="background-color"
          placeholder={state.props.backgroundColor.computed}
          onChange={state.props.backgroundColor.onChangeWithoutCommit}
          onChangeEnd={state.props.backgroundColor.onChange}
        />
      </RowGroup>
    </Pane>
  );
});
