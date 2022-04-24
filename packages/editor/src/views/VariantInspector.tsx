import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import {
  Pane,
  TopLabelArea,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { TextArea } from "@seanchas116/paintkit/src/components/TextArea";
import { Label } from "@seanchas116/paintkit/src/components/Label";
import { MIXED } from "@seanchas116/paintkit/src/util/Mixed";
import { useEditorState } from "./EditorStateContext";

const VariantInspectorWrap = styled.div``;

export const VariantInspector: React.FC = observer(() => {
  const state = useEditorState().elementInspectorState;
  const { innerHTML } = state;

  return (
    <VariantInspectorWrap>
      <Pane>
        <TopLabelArea>
          <Label>Inner HTML</Label>
          <TextArea
            value={typeof innerHTML === "string" ? innerHTML : undefined}
            placeholder={innerHTML === MIXED ? "Mixed" : undefined}
          />
        </TopLabelArea>
      </Pane>
    </VariantInspectorWrap>
  );
});
