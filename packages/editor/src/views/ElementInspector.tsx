import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import {
  Pane,
  Row12,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { ComboBox } from "@seanchas116/paintkit/src/components/ComboBox";
import { Label } from "@seanchas116/paintkit/src/components/Label";
import { Input } from "@seanchas116/paintkit/src/components/Input";
import { useEditorState } from "./EditorStateContext";

const ElementInspectorWrap = styled.div``;

export const ElementInspector: React.FC = observer(() => {
  const state = useEditorState().elementInspectorState;

  return (
    <ElementInspectorWrap>
      <Pane>
        <ComboBox
          value={state.tagName}
          options={["div", "h1"].map((value) => ({ value }))}
          onChange={(value) => {
            // TODO
            return false;
          }}
        />
        <Row12>
          <Label>ID</Label>
          <Input value={state.id} onChange={state.onChangeID} />
        </Row12>
      </Pane>
    </ElementInspectorWrap>
  );
});
