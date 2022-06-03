import React from "react";
import styled from "styled-components";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { ContextMenuProvider } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { EditorState } from "../state/EditorState";
import { RightSideBar } from "./sidebar/SideBar";
import { ToolBar } from "./ToolBar";
import { Viewport } from "./viewport/Viewport";
import { EditorStateProvider } from "./useEditorState";

const Columns = styled.div`
  display: flex;
  background-color: ${colors.background};
`;

const Center = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledViewport = styled(Viewport)`
  flex: 1;
`;

export const Editor: React.FC<{
  className?: string;
  editorState: EditorState;
}> = ({ className, editorState }) => {
  return (
    <EditorStateProvider value={editorState}>
      <ContextMenuProvider>
        <Columns
          className={className}
          onContextMenuCapture={(e) => e.preventDefault()}
        >
          <Center>
            <ToolBar />
            <StyledViewport />
          </Center>
          <RightSideBar />
        </Columns>
      </ContextMenuProvider>
    </EditorStateProvider>
  );
};
