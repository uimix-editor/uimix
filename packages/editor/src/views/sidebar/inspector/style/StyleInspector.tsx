import { Button } from "@seanchas116/paintkit/src/components/Button";
import { Pane } from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { useEditorState } from "../../../EditorStateContext";
import { BackgroundPane } from "./BackgroundPane";
import { BorderPane } from "./BorderPane";
import { EffectsPane } from "./EffectsPane";
import { ImagePane } from "./ImagePane";
import { LayoutPane } from "./LayoutPane";
import { PositionPane } from "./PositionPane";
import { SizePane } from "./SizePane";
import { TextPane } from "./TextPane";

const StyleInspectorWrap = styled.div``;

export const StyleInspector: React.FC = observer(function StyleInspector() {
  const editorState = useEditorState();

  const state = useMemo(
    () => new StyleInspectorState(editorState),
    [editorState]
  );

  if (state.mustAssignID) {
    return (
      <StyleInspectorWrap>
        <Pane>
          <Button primary onClick={state.onAssignID}>
            Assign ID to edit style
          </Button>
        </Pane>
      </StyleInspectorWrap>
    );
  }

  if (state.instances.length === 0) {
    return null;
  }

  return (
    <StyleInspectorWrap>
      <PositionPane state={state} />
      <SizePane state={state} />
      <LayoutPane state={state} />
      <TextPane state={state} />
      <ImagePane state={state} />
      <BackgroundPane state={state} />
      <BorderPane state={state} />
      <EffectsPane state={state} />
    </StyleInspectorWrap>
  );
});
