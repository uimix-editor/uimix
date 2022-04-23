import React, { useMemo } from "react";
import {
  ColorSchemeProvider,
  PaintkitProvider,
} from "@seanchas116/paintkit/src/components/GlobalStyle";
import { ContextMenuProvider } from "@seanchas116/paintkit/dist/components/menu/ContextMenuProvider";
import { Editor } from "./views/Editor";
import { AppEditorState } from "./AppEditorState";
import { File } from "./File";

export const App: React.FC<{
  file: File;
}> = ({ file }) => {
  const editorState = useMemo(() => {
    return new AppEditorState(file);
  }, [file]);

  return (
    <ColorSchemeProvider colorScheme="auto">
      <PaintkitProvider>
        <ContextMenuProvider>
          <Editor editorState={editorState} />
        </ContextMenuProvider>
      </PaintkitProvider>
    </ColorSchemeProvider>
  );
};
