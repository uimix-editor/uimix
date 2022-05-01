import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { useEditorState } from "../../../EditorStateContext";
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

  if (state.styles.length === 0) {
    return null;
  }

  return (
    <StyleInspectorWrap>
      <PositionPane state={state} />
      <SizePane state={state} />
      <TextPane state={state} />
    </StyleInspectorWrap>
  );
});
