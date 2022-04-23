import React, { useMemo } from "react";
import {
  ColorSchemeProvider,
  PaintkitProvider,
} from "@seanchas116/paintkit/src/components/GlobalStyle";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";
import { ContextMenuProvider } from "@seanchas116/paintkit/dist/components/menu/ContextMenuProvider";
import { Editor } from "./views/Editor";
import { EditorState } from "./state/EditorState";
import { Document, DocumentJSON } from "./models/Document";

export const App: React.FC<{
  history: JSONUndoHistory<DocumentJSON, Document>;
}> = ({ history }) => {
  const editorState = useMemo(() => {
    return new EditorState(history);
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
