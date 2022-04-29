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
import { Select } from "@seanchas116/paintkit/src/components/Select";
import { StyleInspectorState } from "../../../state/StyleInspectorState";
import { useEditorState } from "../../EditorStateContext";

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
            <Select
              value={"100"}
              placeholder="Weight"
              options={[
                { value: "100", text: "Thin" },
                { value: "200", text: "Extra Light" },
                { value: "300", text: "Light" },
                { value: "400", text: "Normal" },
                { value: "500", text: "Medium" },
                { value: "600", text: "Semi Bold" },
                { value: "700", text: "Bold" },
                { value: "800", text: "Extra Bold" },
                { value: "900", text: "Black" },
              ]}
              onChange={(value: string) => {
                // TODO
              }}
            />
          </Row11>
        </RowGroup>
      </Pane>
    </StyleInspectorWrap>
  );
});
