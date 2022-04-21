import React, { useState } from "react";
import "./App.css";
import {
  ColorSchemeProvider,
  PaintkitProvider,
} from "@seanchas116/paintkit/src/components/GlobalStyle";
import { Editor } from "./views/Editor";
import { EditorState } from "./state/EditorState";
import { Document, DocumentJSON } from "./models/Document";
import { JSONUndoHistory } from "@seanchas116/paintkit/src/util/JSONUndoHistory";

function App() {
  const [editorState] = useState(() => {
    const document = new Document();
    const history = new JSONUndoHistory<DocumentJSON, Document>(document);
    return new EditorState(history);
  });

  return (
    <ColorSchemeProvider colorScheme="auto">
      <PaintkitProvider>
        <Editor editorState={editorState} />
      </PaintkitProvider>
    </ColorSchemeProvider>
  );
}

export default App;
