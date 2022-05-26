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
import { CSSColorInput } from "@seanchas116/paintkit/src/components/css/CSSColorInput";
import { useEditorState } from "../../EditorStateContext";

const VariantInspectorWrap = styled.div``;

export const VariantInspector: React.FC = observer(() => {
  const state = useEditorState().variantInspectorState;

  return (
    <VariantInspectorWrap>
      <Pane>
        <PaneHeadingRow>
          <PaneHeading>Artboard</PaneHeading>
        </PaneHeadingRow>
        <RowGroup>
          <Row111>
            <NumberInput icon="X" value={state.x} onChange={state.onXChange} />
            <NumberInput icon="Y" value={state.y} onChange={state.onYChange} />
          </Row111>
          <Row111>
            <NumberInput
              icon="W"
              title="Width"
              placeholder="Auto"
              value={state.width}
              onChange={state.onWidthChange}
            />
            <NumberInput
              icon="H"
              title="Height"
              placeholder="Auto"
              value={state.height}
              onChange={state.onHeightChange}
            />
          </Row111>
        </RowGroup>

        <TopLabelArea>
          <Label>Background Color</Label>
          <CSSColorInput />
        </TopLabelArea>
      </Pane>

      {state.selectedVariants.length > 0 && (
        <Pane>
          <PaneHeadingRow>
            <PaneHeading>Condition</PaneHeading>
          </PaneHeadingRow>
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
        </Pane>
      )}
    </VariantInspectorWrap>
  );
});
