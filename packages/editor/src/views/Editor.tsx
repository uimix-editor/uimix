import React, { useEffect } from "react";
import styled from "styled-components";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { action } from "mobx";
import { ContextMenuProvider } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { EditorState } from "../state/EditorState";
import { RightSideBar } from "./sidebar/SideBar";
import { EditorStateContext } from "./EditorStateContext";
import { ToolBar } from "./ToolBar";
import { Viewport } from "./viewport/Viewport";

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
  // TODO: avoid attaching listeners to window
  useEffect(() => {
    const onWindowKeyDown = action((e: KeyboardEvent) => {
      if (editorState.handleGlobalKeyDown(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    const onWindowKeyUp = action((e: KeyboardEvent) => {
      editorState.handleGlobalKeyUp(e);
    });

    window.addEventListener("keydown", onWindowKeyDown, { capture: true });
    window.addEventListener("keyup", onWindowKeyUp, { capture: true });
    return () => {
      window.removeEventListener("keydown", onWindowKeyDown, { capture: true });
      window.removeEventListener("keyup", onWindowKeyUp, { capture: true });
    };
  }, []);

  return (
    <EditorStateContext.Provider value={editorState}>
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
    </EditorStateContext.Provider>
  );
};
