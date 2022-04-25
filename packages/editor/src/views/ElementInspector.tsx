import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  Row12,
  TopLabelArea,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { ComboBox } from "@seanchas116/paintkit/src/components/ComboBox";
import { TextArea } from "@seanchas116/paintkit/src/components/TextArea";
import { Label } from "@seanchas116/paintkit/src/components/Label";
import { Input } from "@seanchas116/paintkit/src/components/Input";
import { KeyValueEdit } from "@seanchas116/paintkit/src/components/treeview/KeyValueEdit";
import { SelectOption } from "@seanchas116/paintkit/src/components/Select";
import { MIXED } from "@seanchas116/paintkit/src/util/Mixed";
import {
  PlusButton,
  MinusButton,
} from "@seanchas116/paintkit/src/components/IconButton";
import { useEditorState } from "./EditorStateContext";

const ElementInspectorWrap = styled.div``;

const tagNameOptions: SelectOption[] = ["div", "h1"].map((value) => ({
  value,
}));

const StyledKeyValueEdit = styled(KeyValueEdit)`
  margin: -12px;
  margin-top: 0;
`;

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
        <TopLabelArea>
          <Label>Inner HTML</Label>
          <TextArea
            value={typeof innerHTML === "string" ? innerHTML : undefined}
            placeholder={innerHTML === MIXED ? "Mixed" : undefined}
          />
        </TopLabelArea>
      </Pane>
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
    </ElementInspectorWrap>
  );
});
