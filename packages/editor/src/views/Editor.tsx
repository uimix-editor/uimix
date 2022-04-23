import React from "react";
import styled from "styled-components";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { EditorState } from "../state/EditorState";
import { RightSideBar } from "./SideBar";
import { EditorStateContext } from "./EditorStateContext";
import { ToolBar } from "./ToolBar";

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
          <ToolBar />
          <Viewport />
        </Center>
        <RightSideBar />
      </Columns>
    </EditorStateContext.Provider>
  );
};
