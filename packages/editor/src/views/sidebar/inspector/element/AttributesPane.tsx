import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { KeyValueEdit } from "@seanchas116/paintkit/src/components/treeview/KeyValueEdit";
import {
  PlusButton,
  MinusButton,
} from "@seanchas116/paintkit/src/components/IconButton";
import { useEditorState } from "../../../useEditorState";

const StyledKeyValueEdit = styled(KeyValueEdit)`
  margin: -12px;
  margin-top: 0;
`;

export const AttributesPane: React.FC = observer(function AttributesPane() {
  const state = useEditorState().elementInspectorState;

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Attributes</PaneHeading>
        <PlusButton onClick={state.onAddAttr} />
        <MinusButton onClick={state.onDeleteAttrs} />
      </PaneHeadingRow>
      <StyledKeyValueEdit
        map={state.attrs}
        selection={state.selectedAttrKeys}
        onChangeSelection={state.onChangeSelectedAttrKeys}
        onReorder={state.onReorderAttrs}
        onChangeKey={state.onChangeAttrKey}
        onChangeValue={state.onChangeAttrValue}
      />
    </Pane>
  );
});
