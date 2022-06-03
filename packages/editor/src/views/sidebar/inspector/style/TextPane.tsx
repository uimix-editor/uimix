import { observer } from "mobx-react-lite";
import React from "react";
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
  PaneHeadingRow,
  Row11,
  Row111,
  RowGroup,
  RowPackLeft,
} from "@seanchas116/paintkit/src/components/sidebar/Inspector";
import { ComboBox } from "@seanchas116/paintkit/src/components/ComboBox";
import strikethroughIcon from "@iconify-icons/ic/outline-strikethrough-s";
import underlineIcon from "@iconify-icons/ic/outline-format-underlined";
import closeIcon from "@iconify-icons/ic/outline-close";
import { stripQuotes } from "@seanchas116/paintkit/src/util/String";
import { StyleInspectorState } from "../../../../state/StyleInspectorState";
import { useEditorState } from "../../../useEditorState";
import { lengthPercentageEmptyUnits, lengthPercentageUnits } from "./Units";
import {
  StyleColorInput,
  StyleComboBox,
  StyleDimensionInput,
  StyleIconRadio,
} from "./Components";

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

const fontWeightOptions = [
  { value: "100", text: "100" },
  { value: "200", text: "200" },
  { value: "300", text: "300" },
  { value: "400", text: "400 (normal)" },
  { value: "500", text: "500" },
  { value: "600", text: "600" },
  { value: "700", text: "700 (bold)" },
  { value: "800", text: "800" },
  { value: "900", text: "900" },
];

export const TextPane: React.FC<{
  state: StyleInspectorState;
}> = observer(function TextPane({ state }) {
  const editorState = useEditorState();

  if (!state.textInstances.length) {
    return null;
  }

  return (
    <Pane>
      <PaneHeadingRow>
        <PaneHeading>Text</PaneHeading>
      </PaneHeadingRow>
      <RowGroup>
        <ComboBox
          icon={fontDownloadIcon}
          title="font-family"
          value={state.props.fontFamily.value}
          placeholder={stripQuotes(state.props.fontFamily.computed ?? "")}
          options={editorState.fontFamilyOptions}
          onChange={state.props.fontFamily.onChange}
        />
        <Row11>
          <StyleComboBox
            icon={lineWeightIcon}
            options={fontWeightOptions}
            property={state.props.fontWeight}
          />
          <StyleColorInput property={state.props.color} />
        </Row11>
        <Row111>
          <StyleDimensionInput
            icon={formatSizeIcon}
            units={lengthPercentageUnits}
            property={state.props.fontSize}
          />
          <StyleDimensionInput
            icon={lineSpacingIcon}
            units={lengthPercentageEmptyUnits}
            property={state.props.lineHeight}
          />
          <StyleDimensionInput
            icon={spaceBarIcon}
            units={lengthPercentageEmptyUnits}
            property={state.props.letterSpacing}
          />
        </Row111>
        <RowPackLeft>
          <StyleIconRadio
            options={fontStyleOptions}
            property={state.props.fontStyle}
          />
          <StyleIconRadio
            options={textDecorationOptions}
            property={state.props.textDecorationLine}
          />
        </RowPackLeft>
        <StyleIconRadio
          options={textAlignOptions}
          property={state.props.textAlign}
        />
      </RowGroup>
    </Pane>
  );
});
