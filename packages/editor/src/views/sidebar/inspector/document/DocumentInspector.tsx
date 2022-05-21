import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import {
  MinusButton,
  PlusButton,
} from "@seanchas116/paintkit/src/components/IconButton";
import {
  Pane,
  PaneHeadingRow,
  PaneHeading,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { useEditorState } from "../../../EditorStateContext";
import { ColorTokenTreeView } from "./ColorTokenTreeView";

const PageInspectorWrap = styled.div``;

const StyledColorTokenTreeView = styled(ColorTokenTreeView)`
  margin: -8px -12px;
`;

export const DocumentInspector: React.FC = observer(
  function DocumentInspector() {
    const editorState = useEditorState();
    const document = editorState.document;
    return (
      <PageInspectorWrap>
        <Pane>
          <PaneHeadingRow>
            <PaneHeading>Color Tokens</PaneHeading>
            <MinusButton
              disabled={document.cssVariables.children.every(
                (token) => !token.selected
              )}
              onClick={action(() => {
                // ColorTokenAction.delete(editorState);
                // editorState.commit("Delete Color Tokens");
              })}
            />
            <PlusButton
              onClick={action(() => {
                // ColorTokenAction.add(editorState, Color.from("white"));
                // editorState.commit("Add Color Token");
              })}
            />
          </PaneHeadingRow>
          {!!document.cssVariables.firstChild && (
            <StyledColorTokenTreeView editorState={editorState} />
          )}
        </Pane>
      </PageInspectorWrap>
    );
  }
);
