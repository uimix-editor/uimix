import React, { useCallback } from "react";
import menuIcon from "@iconify-icons/ic/outline-menu";
import paragraphIcon from "@seanchas116/paintkit/src/icon/Paragraph";
import frameIcon from "@seanchas116/paintkit/src/icon/Frame";
import imageIcon from "@seanchas116/paintkit/src/icon/Image";
import { ToolBar as ToolBarWrap } from "@seanchas116/paintkit/src/components/toolbar/ToolBar";
import {
  ToolButton,
  ToolButtonArray,
  ToolButtonArrayGroup,
} from "@seanchas116/paintkit/src/components/toolbar/ToolButton";
import { Dropdown } from "@seanchas116/paintkit/src/components/menu/Dropdown";
import { ZoomControl } from "@seanchas116/paintkit/src/components/toolbar/ZoomControl";
import { observer } from "mobx-react-lite";
import { action } from "mobx";
import styled from "styled-components";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { useEditorState } from "./useEditorState";

const FeedbackButton = styled.a`
  background-color: ${colors.active};
  font-size: 12px;
  line-height: 12px;
  height: 20px;
  color: ${colors.activeText};
  padding: 4px 8px;
  text-decoration: none;
  border-radius: 10px;

  :hover {
    color: ${colors.activeText};
    filter: saturate(1.5);
  }
`;

export const ToolBar: React.FC = observer(() => {
  const editorState = useEditorState();

  const onFrameToolClick = useCallback(
    action(() => {
      editorState.insertMode = "frame";
    }),
    []
  );
  const onTextToolClick = useCallback(
    action(() => {
      editorState.insertMode = "text";
    }),
    []
  );
  const onImageToolClick = useCallback(
    action(() => {
      editorState.insertMode = "image";
    }),
    []
  );

  const onZoomOut = useCallback(
    action(() => editorState.scroll.zoomOut()),
    [editorState]
  );
  const onZoomIn = useCallback(
    action(() => editorState.scroll.zoomIn()),
    [editorState]
  );
  const onChangeZoomPercent = useCallback(
    action((percent: number) =>
      editorState.scroll.zoomAroundCenter(percent / 100)
    ),
    [editorState]
  );

  return (
    <ToolBarWrap>
      <ToolButtonArrayGroup>
        <Dropdown
          options={editorState.getMainMenu()}
          button={(open, onClick) => (
            <ToolButton
              label="Menu"
              icon={menuIcon}
              selected={open}
              onClick={(_, elem) => onClick(elem)}
            />
          )}
        />
        <FeedbackButton
          href="https://form.jotform.com/220732261468454"
          target="_blank"
        >
          Feedback
        </FeedbackButton>
      </ToolButtonArrayGroup>

      <ToolButtonArray>
        <ToolButton
          selected={editorState.insertMode === "frame"}
          label="Frame"
          icon={frameIcon}
          onClick={onFrameToolClick}
        />
        <ToolButton
          selected={editorState.insertMode === "text"}
          label="Text"
          icon={paragraphIcon}
          onClick={onTextToolClick}
        />
        <ToolButton
          selected={editorState.insertMode === "image"}
          label="Image"
          icon={imageIcon}
          onClick={onImageToolClick}
        />
      </ToolButtonArray>

      <ZoomControl
        percentage={Math.round(editorState.scroll.scale * 100)}
        onZoomOut={onZoomOut}
        onZoomIn={onZoomIn}
        onChangePercentage={onChangeZoomPercent}
      />
    </ToolBarWrap>
  );
});
