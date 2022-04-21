import React, { useState } from "react";
import "./App.css";
import {
  ColorSchemeProvider,
  PaintkitProvider,
} from "@seanchas116/paintkit/src/components/GlobalStyle";
import { Editor } from "./views/Editor";

function App() {
  return (
    <ColorSchemeProvider colorScheme="auto">
      <PaintkitProvider>
        <Editor />
      </PaintkitProvider>
    </ColorSchemeProvider>
  );
}

export default App;
