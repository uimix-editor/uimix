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
import { Color } from "@seanchas116/paintkit/src/util/Color";
import { useEditorState } from "../../../useEditorState";
import { CSSVariableListView } from "./CSSVariableListView";

const StyledColorTokenTreeView = styled(CSSVariableListView)`
  margin: -8px -12px;
`;

export const CSSVariablesPane: React.FC = observer(
  function DocumentInspector() {
    const editorState = useEditorState();
    const cssVariables = editorState.document.cssVariables;
    return (
      <Pane>
        <PaneHeadingRow>
          <PaneHeading>CSS Variables</PaneHeading>
          <MinusButton
            disabled={cssVariables.children.every((token) => !token.selected)}
            onClick={action(() => {
              cssVariables.deleteSelected();
              editorState.history.commit("Delete CSS Variable");
            })}
          />
          <PlusButton
            onClick={action(() => {
              const variable = cssVariables.add(Color.fromName("white"));
              cssVariables.deselectAll();
              variable.selected = true;
              editorState.history.commit("Add CSS Variable");
            })}
          />
        </PaneHeadingRow>
        {!!cssVariables.firstChild && <StyledColorTokenTreeView />}
      </Pane>
    );
  }
);
