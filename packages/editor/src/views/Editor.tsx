import React from "react";
import styled from "styled-components";
import menuIcon from "@iconify-icons/ic/outline-menu";
import paragraphIcon from "@seanchas116/paintkit/src/icon/Paragraph";
import frameIcon from "@seanchas116/paintkit/src/icon/Frame";
import { ToolBar } from "@seanchas116/paintkit/src/components/toolbar/ToolBar";
import {
  ToolButton,
  ToolButtonArray,
} from "@seanchas116/paintkit/src/components/toolbar/ToolButton";
import { ZoomControl } from "@seanchas116/paintkit/src/components/toolbar/ZoomControl";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { EditorState } from "../state/EditorState";
import { RightSideBar } from "./SideBar";
import { EditorStateContext } from "./EditorStateContext";

const Columns = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  display: flex;
  background-color: ${colors.background};
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Viewport = styled.div`
  background-color: ${colors.uiBackground};
  flex: 1;
`;

export const Editor: React.FC<{ editorState: EditorState }> = ({
  editorState,
}) => {
  return (
    <EditorStateContext.Provider value={editorState}>
      <Columns onContextMenuCapture={(e) => e.preventDefault()}>
        <Center>
          <ToolBar>
            <ToolButton label="Menu" icon={menuIcon} />

            <ToolButtonArray>
              <ToolButton label="Frame" icon={frameIcon} />
              <ToolButton label="Text" icon={paragraphIcon} />
            </ToolButtonArray>

            <ZoomControl
              percentage={100}
              onZoomIn={() => {}}
              onZoomOut={() => {}}
              onChangePercentage={() => {}}
            />
          </ToolBar>
          <Viewport />
        </Center>
        <RightSideBar />
      </Columns>
    </EditorStateContext.Provider>
  );
};
