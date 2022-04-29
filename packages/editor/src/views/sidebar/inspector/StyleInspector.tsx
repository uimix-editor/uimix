import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import { useEditorState } from "../../EditorStateContext";
import { StyleInspectorState } from "../../../state/StyleInspectorState";

const StyleInspectorWrap = styled.div``;

export const StyleInspector: React.FC = observer(function StyleInspector() {
  const editorState = useEditorState();

  const state = useMemo(
    () => new StyleInspectorState(editorState),
    [editorState]
  );

  return <StyleInspectorWrap></StyleInspectorWrap>;
});
