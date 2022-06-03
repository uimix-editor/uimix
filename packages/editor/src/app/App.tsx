import React, { useEffect, useMemo } from "react";
import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import { reaction } from "mobx";
import styled, { createGlobalStyle } from "styled-components";
import { fontFamily } from "@seanchas116/paintkit/src/components/Common";
import { Editor } from "../views/Editor";
import { AppEditorState } from "./AppEditorState";
import { File } from "./File";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    overflow: hidden;
    overscroll-behavior-x: none;
    font-family: ${fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .tippy-content {
    font-size: 12px;
  }
`;

const StyledEditor = styled(Editor)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

export const App: React.FC<{
  file: File;
}> = ({ file }) => {
  const editorState = useMemo(() => {
    return new AppEditorState(file);
  }, [file]);

  useEffect(() => {
    return reaction(
      () => editorState.windowTitle,
      (title) => {
        document.title = title;
      },
      { fireImmediately: true }
    );
  }, [editorState]);

  return (
    <>
      <GlobalStyle />
      <PaintkitRoot colorScheme="auto">
        <StyledEditor editorState={editorState} />
      </PaintkitRoot>
    </>
  );
};
