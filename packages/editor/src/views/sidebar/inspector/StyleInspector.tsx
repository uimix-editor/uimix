import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import {
  Pane,
  PaneHeading,
  Row11,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { ComboBox } from "@seanchas116/paintkit/src/components/ComboBox";
import { StyleInspectorState } from "../../../state/StyleInspectorState";
import { useEditorState } from "../../EditorStateContext";
import { CSSColorInput } from "./CSSColorInput";

const StyleInspectorWrap = styled.div``;

export const StyleInspector: React.FC = observer(function StyleInspector() {
  const editorState = useEditorState();

  const state = useMemo(
    () => new StyleInspectorState(editorState),
    [editorState]
  );

  return (
    <StyleInspectorWrap>
      <Pane>
        <PaneHeading>Text</PaneHeading>
        <RowGroup>
          <ComboBox
            value={state.fontFamily.value}
            options={["Times", "Helvetica"].map((value) => ({ value }))}
            onChange={state.fontFamily.onChange}
          />
          <Row11>
            <ComboBox
              value={state.fontWeight.value}
              placeholder="Weight"
              options={[
                { value: "100", text: "100" },
                { value: "200", text: "200" },
                { value: "300", text: "300" },
                { value: "400", text: "400 (normal)" },
                { value: "500", text: "500" },
                { value: "600", text: "600" },
                { value: "700", text: "700 (bold)" },
                { value: "800", text: "800" },
                { value: "900", text: "900" },
              ]}
              onChange={state.fontWeight.onChange}
            />
            <CSSColorInput
              value={state.color.value}
              onChange={state.color.onChangeWithoutCommit}
              onChangeEnd={state.color.onChange}
            />
          </Row11>
        </RowGroup>
      </Pane>
    </StyleInspectorWrap>
  );
});
