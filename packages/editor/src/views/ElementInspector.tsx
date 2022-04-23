import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import {
  Pane,
  Row12,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { ComboBox } from "@seanchas116/paintkit/src/components/ComboBox";
import { TextArea } from "@seanchas116/paintkit/src/components/TextArea";
import { Label } from "@seanchas116/paintkit/src/components/Label";
import { Input } from "@seanchas116/paintkit/src/components/Input";
import { SelectOption } from "@seanchas116/paintkit/src/components/Select";
import { MIXED } from "@seanchas116/paintkit/src/util/Mixed";
import { useEditorState } from "./EditorStateContext";

const ElementInspectorWrap = styled.div``;

const tagNameOptions: SelectOption[] = ["div", "h1"].map((value) => ({
  value,
}));

export const ElementInspector: React.FC = observer(() => {
  const state = useEditorState().elementInspectorState;
  const { innerHTML } = state;

  return (
    <ElementInspectorWrap>
      <Pane>
        <ComboBox
          value={state.tagName}
          options={tagNameOptions}
          onChange={state.onChangeTagName}
        />
        <Row12>
          <Label>ID</Label>
          <Input value={state.id} onChange={state.onChangeID} />
        </Row12>

        <TextArea
          value={typeof innerHTML === "string" ? innerHTML : undefined}
          placeholder={innerHTML === MIXED ? "Mixed" : undefined}
        />
      </Pane>
    </ElementInspectorWrap>
  );
});
