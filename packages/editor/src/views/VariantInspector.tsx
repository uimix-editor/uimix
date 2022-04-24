import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  TopLabelArea,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { Label } from "@seanchas116/paintkit/src/components/Label";
import { Input } from "@seanchas116/paintkit/src/components/Input";
import { useEditorState } from "./EditorStateContext";

const VariantInspectorWrap = styled.div``;

export const VariantInspector: React.FC = observer(() => {
  const state = useEditorState().variantInspectorState;

  return (
    <VariantInspectorWrap>
      <Pane>
        <PaneHeadingRow>
          <PaneHeading>Variant</PaneHeading>
        </PaneHeadingRow>
        {state.selectedVariants.length > 0 && (
          <TopLabelArea>
            <Label>Selector</Label>
            <Input value={state.selector} onChange={state.onChangeSelector} />
          </TopLabelArea>
        )}
      </Pane>
    </VariantInspectorWrap>
  );
});
