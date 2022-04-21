import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  ColorSchemeProvider,
  PaintkitProvider,
} from "@seanchas116/paintkit/dist/components/GlobalStyle";
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
