import React, { useEffect, useMemo } from "react";
import { PaintkitRoot } from "@seanchas116/paintkit/src/components/PaintkitRoot";
import styled, { createGlobalStyle } from "styled-components";
import { fontFamily } from "@seanchas116/paintkit/src/components/Common";
import { Editor } from "../views/Editor";
import { VSCodeEditorState } from "./VSCodeEditorState";
import { VSCodeAppState } from "./VSCodeAppState";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    overflow: hidden;
    overscroll-behavior-x: none;
    font-family: ${fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    --macaron-background: var(--vscode-breadcrumb-background);
  }

  * {
    outline: none !important;
  }

  .tippy-content {
    font-family: ${fontFamily};
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

export const VSCodeApp: React.FC<{
  appState: VSCodeAppState;
}> = ({ appState }) => {
  const editorState = useMemo(() => {
    return new VSCodeEditorState(appState);
  }, [appState]);

  useEffect(() => editorState.listenKeyEvents(window), [editorState]);

  return (
    <>
      <GlobalStyle />
      <PaintkitRoot
        colorScheme="auto"
        lightSelector=".vscode-light &"
        darkSelector=".vscode-dark &, .vscode-high-contrast &"
      >
        <StyledEditor editorState={editorState} />
      </PaintkitRoot>
    </>
  );
};
