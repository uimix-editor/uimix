import React, { useMemo } from "react";
import {
  ColorSchemeProvider,
  PaintkitProvider,
} from "@seanchas116/paintkit/src/components/GlobalStyle";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { ContextMenuProvider } from "@seanchas116/paintkit/dist/components/menu/ContextMenuProvider";
import { Editor } from "./views/Editor";
import { Document, DocumentJSON } from "./models/Document";
import { AppEditorState } from "./AppEditorState";

export const App: React.FC<{
  history: JSONUndoHistory<DocumentJSON, Document>;
}> = ({ history }) => {
  const editorState = useMemo(() => {
    return new AppEditorState(history);
  }, [history]);

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
