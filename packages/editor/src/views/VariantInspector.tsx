import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import {
  Pane,
  PaneHeading,
  PaneHeadingRow,
  Row111,
  RowGroup,
  TopLabelArea,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { Label } from "@seanchas116/paintkit/src/components/Label";
import { Input } from "@seanchas116/paintkit/src/components/Input";
import { NumberInput } from "@seanchas116/paintkit/src/components/NumberInput";
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
        <RowGroup>
          <Row111>
            <NumberInput
              label="X"
              iconPosition="left"
              value={state.x}
              onChange={state.onXChange}
            />
            <NumberInput
              label="Y"
              iconPosition="left"
              value={state.y}
              onChange={state.onYChange}
            />
          </Row111>
          <Row111>
            <NumberInput
              label="W"
              title="Width"
              iconPosition="left"
              placeholder="Auto"
              value={state.width}
              onChange={state.onWidthChange}
            />
            <NumberInput
              label="H"
              title="Height"
              iconPosition="left"
              placeholder="Auto"
              value={state.height}
              onChange={state.onHeightChange}
            />
          </Row111>
        </RowGroup>

        {state.selectedVariants.length > 0 && (
          <>
            <TopLabelArea>
              <Label>Selector</Label>
              <Input
                value={state.selector}
                onChange={state.onChangeSelector}
                placeholder='e.g. ":hover", "[type="primary"]"'
              />
            </TopLabelArea>
            <TopLabelArea>
              <Label>Media Query</Label>
              <Input
                value={state.mediaQuery}
                onChange={state.onChangeMediaQuery}
                placeholder='e.g. "(max-width: 768px)"'
              />
            </TopLabelArea>
          </>
        )}
      </Pane>
    </VariantInspectorWrap>
  );
});
