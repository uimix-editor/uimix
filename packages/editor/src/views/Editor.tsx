import React, { useEffect } from "react";
import styled from "styled-components";
import { colors } from "@seanchas116/paintkit/src/components/Palette";
import { action } from "mobx";
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
  // TODO: avoid attaching listeners to window
  useEffect(() => {
    const onWindowKeyDown = action((e: KeyboardEvent) => {
      if (editorState.handleGlobalKeyDown(e)) {
        e.preventDefault();
      }
    });
    const onWindowKeyUp = action((e: KeyboardEvent) => {
      editorState.handleGlobalKeyUp(e);
    });

    window.addEventListener("keydown", onWindowKeyDown);
    window.addEventListener("keyup", onWindowKeyUp);
    return () => {
      window.removeEventListener("keydown", onWindowKeyDown);
      window.removeEventListener("keyup", onWindowKeyUp);
    };
  }, []);

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
