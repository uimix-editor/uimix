import { observer } from "mobx-react-lite";
import React from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { CSSBackgroundImageInput } from "@seanchas116/paintkit/src/components/css/CSSBackgroundImageInput";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { StyleColorInput } from "./Components";

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
        <CSSBackgroundImageInput
          title="background-image"
          value={state.props.backgroundImage.value}
          placeholder={state.props.backgroundImage.computed}
          onChange={state.props.backgroundImage.onChangeWithoutCommit}
          onChangeEnd={state.props.backgroundImage.onChangeCommit}
        />
        <StyleColorInput property={state.props.backgroundColor} />
      </RowGroup>
    </Pane>
  );
});
