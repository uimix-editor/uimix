import React, { useMemo } from "react";
import {
  ColorSchemeProvider,
  PaintkitProvider,
} from "@seanchas116/paintkit/src/components/GlobalStyle";
import { ContextMenuProvider } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { createGlobalStyle } from "styled-components";
import { fontFamily } from "@seanchas116/paintkit/src/components/Common";
import { Editor } from "../views/Editor";
import { VSCodeFile } from "./VSCodeFile";
import { VSCodeEditorState } from "./VSCodeEditorState";

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

export const VSCodeApp: React.FC<{
  file: VSCodeFile;
}> = ({ file }) => {
  const editorState = useMemo(() => {
    return new VSCodeEditorState(file);
  }, [file]);

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
