import React, { useMemo } from "react";
import { PaintkitProvider } from "@seanchas116/paintkit/src/components/GlobalStyle";
import { ContextMenuProvider } from "@seanchas116/paintkit/src/components/menu/ContextMenuProvider";
import { createGlobalStyle } from "styled-components";
import { fontFamily } from "@seanchas116/paintkit/src/components/Common";
import {
  darkColorCSSVariables,
  lightColorCSSVariables,
} from "@seanchas116/paintkit/src/components/Palette";
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

  body.vscode-light {
    ${lightColorCSSVariables};
  }

  body.vscode-dark, body.vscode-high-contrast {
    ${darkColorCSSVariables};
  }

  * {
    outline: none !important;
  }

  .tippy-content {
    font-family: ${fontFamily};
    font-size: 12px;
  }
`;

export const VSCodeApp: React.FC<{
  appState: VSCodeAppState;
}> = ({ appState }) => {
  const editorState = useMemo(() => {
    return new VSCodeEditorState(appState);
  }, [appState]);

  return (
    <>
      <GlobalStyle />
      <PaintkitProvider>
        <ContextMenuProvider>
          <Editor editorState={editorState} />
        </ContextMenuProvider>
      </PaintkitProvider>
    </>
  );
};
