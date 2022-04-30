import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import spaceBarIcon from "@iconify-icons/ic/outline-space-bar";
import formatSizeIcon from "@iconify-icons/ic/outline-format-size";
import lineSpacingIcon from "@iconify-icons/ic/outline-format-line-spacing";
import {
  Pane,
  PaneHeading,
  Row11,
  Row111,
  RowGroup,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { ComboBox } from "@seanchas116/paintkit/src/components/ComboBox";
import { DimensionInput } from "@seanchas116/paintkit/src/components/DimensionInput";
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

  if (state.styles.length === 0) {
    return null;
  }

  return (
    <StyleInspectorWrap>
      <Pane>
        <PaneHeading>Text</PaneHeading>
        <RowGroup>
          <ComboBox
            value={state.props.fontFamily.value}
            options={["Times", "Helvetica"].map((value) => ({ value }))}
            onChange={state.props.fontFamily.onChange}
          />
          <Row11>
            <ComboBox
              value={state.props.fontWeight.value}
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
              onChange={state.props.fontWeight.onChange}
            />
            <CSSColorInput
              value={state.props.color.value}
              onChange={state.props.color.onChangeWithoutCommit}
              onChangeEnd={state.props.color.onChange}
            />
          </Row11>
          <Row111>
            <DimensionInput
              icon={formatSizeIcon}
              title="font-size"
              placeholder={state.props.fontSize.placeholder}
              value={state.props.fontSize.value}
              onChange={state.props.fontSize.onChange}
            />
            <DimensionInput
              icon={lineSpacingIcon}
              title="line-height"
              placeholder={state.props.lineHeight.placeholder}
              value={state.props.lineHeight.value}
              onChange={state.props.lineHeight.onChange}
            />
            <DimensionInput
              icon={spaceBarIcon}
              title="letter-spacing"
              placeholder={state.props.letterSpacing.placeholder}
              value={state.props.letterSpacing.value}
              onChange={state.props.letterSpacing.onChange}
            />
          </Row111>
        </RowGroup>
      </Pane>
    </StyleInspectorWrap>
  );
});
