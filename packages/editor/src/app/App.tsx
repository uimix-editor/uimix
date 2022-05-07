import React, { useEffect, useMemo } from "react";
import {
  ColorSchemeProvider,
  PaintkitProvider,
} from "@seanchas116/paintkit/src/components/GlobalStyle";
import { ContextMenuProvider } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { reaction } from "mobx";
import { createGlobalStyle } from "styled-components";
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
    <ColorSchemeProvider colorScheme="auto">
      <GlobalStyle />
      <PaintkitProvider>
        <ContextMenuProvider>
          <Editor editorState={editorState} />
        </ContextMenuProvider>
      </PaintkitProvider>
    </ColorSchemeProvider>
  );
};
