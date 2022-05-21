import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { CSSBackgroundInput } from "@seanchas116/paintkit/src/components/css/CSSBackgroundInput";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { useEditorState } from "../../../EditorStateContext";

export const BackgroundPane: React.FC<{
  state: StyleInspectorState;
}> = observer(function BackgroundPane({ state }) {
  const editorState = useEditorState();
  const resolveImageURL = useCallback(
    (url: string) => state.editorState.resolveImageAssetURL(url),
    [state]
  );

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Background</PaneHeading>
      </PaneHeadingRow>
      <RowGroup>
        <CSSBackgroundInput
          title="background"
          options={editorState.colorInputOptions}
          defaultPlacement="top"
          imageURLOptions={state.editorState.imageURLOptions}
          resolveImageURL={resolveImageURL}
          value={state.props.background.value}
          placeholder={state.props.background.computed}
          onChange={state.props.background.onChangeWithoutCommit}
          onChangeEnd={state.props.background.onChangeCommit}
        />
      </RowGroup>
    </Pane>
  );
});
