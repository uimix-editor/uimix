import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import styled from "styled-components";
import spaceBarIcon from "@iconify-icons/ic/outline-space-bar";
import formatSizeIcon from "@iconify-icons/ic/outline-format-size";
import lineSpacingIcon from "@iconify-icons/ic/outline-format-line-spacing";
import formatAlignLeftIcon from "@iconify-icons/ic/outline-format-align-left";
import formatAlignCenterIcon from "@iconify-icons/ic/outline-format-align-center";
import formatAlignRightIcon from "@iconify-icons/ic/outline-format-align-right";
import lineWeightIcon from "@iconify-icons/ic/outline-line-weight";
import fontDownloadIcon from "@iconify-icons/ic/outline-font-download";
import noItalicIcon from "@seanchas116/paintkit/src/icon/NoItalic";
import italicIcon from "@seanchas116/paintkit/src/icon/Italic";
import {
  Pane,
  PaneHeading,
  Row11,
  Row111,
  RowGroup,
  RowPackLeft,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { ComboBox } from "@seanchas116/paintkit/src/components/ComboBox";
import strikethroughIcon from "@iconify-icons/ic/outline-strikethrough-s";
import underlineIcon from "@iconify-icons/ic/outline-format-underlined";
import closeIcon from "@iconify-icons/ic/outline-close";
import { DimensionInput } from "@seanchas116/paintkit/src/components/DimensionInput";
import { IconRadio } from "@seanchas116/paintkit/src/components/IconRadio";
import { StyleInspectorState } from "../../../state/StyleInspectorState";
import { useEditorState } from "../../EditorStateContext";
import { CSSColorInput } from "./CSSColorInput";

const StyleInspectorWrap = styled.div``;

const textAlignOptions = [
  {
    value: "left",
    icon: formatAlignLeftIcon,
  },
  {
    value: "center",
    icon: formatAlignCenterIcon,
  },
  {
    value: "right",
    icon: formatAlignRightIcon,
  },
];

const fontStyleOptions = [
  {
    value: "normal",
    icon: noItalicIcon,
  },
  {
    value: "italic",
    icon: italicIcon,
  },
];

const textDecorationOptions = [
  {
    value: "none",
    icon: closeIcon,
  },
  {
    value: "underline",
    icon: underlineIcon,
  },
  {
    value: "line-through",
    icon: strikethroughIcon,
  },
];

function stripQuotes(value: string | undefined): string | undefined {
  if (value) {
    return value.replace(/^['"]|['"]$/g, "");
  }
  return value;
}

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
            icon={fontDownloadIcon}
            value={state.props.fontFamily.value}
            placeholder={stripQuotes(state.props.fontFamily.placeholder)}
            options={["Times", "Helvetica"].map((value) => ({ value }))}
            onChange={state.props.fontFamily.onChange}
          />
          <Row11>
            <ComboBox
              icon={lineWeightIcon}
              value={state.props.fontWeight.value}
              placeholder={state.props.fontWeight.placeholder}
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
          <RowPackLeft>
            <IconRadio
              options={fontStyleOptions}
              value={state.props.fontStyle.value}
              placeholder={state.props.fontStyle.placeholder}
              unsettable
              onChange={state.props.fontStyle.onChange}
            />
            <IconRadio
              options={textDecorationOptions}
              value={state.props.textDecorationLine.value}
              placeholder={state.props.textDecorationLine.placeholder}
              unsettable
              onChange={state.props.textDecorationLine.onChange}
            />
          </RowPackLeft>
          <IconRadio
            options={textAlignOptions}
            value={state.props.textAlign.value}
            placeholder={state.props.textAlign.placeholder}
            unsettable
            onChange={state.props.textAlign.onChange}
          />
        </RowGroup>
      </Pane>
    </StyleInspectorWrap>
  );
});
