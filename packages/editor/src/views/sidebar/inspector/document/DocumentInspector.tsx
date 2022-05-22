import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { CSSVariablesPane } from "./CSSVariablesPane";

const DocumentInspectorWrap = styled.div``;

export const DocumentInspector: React.FC = observer(
  function DocumentInspector() {
    return (
      <DocumentInspectorWrap>
        <CSSVariablesPane />
      </DocumentInspectorWrap>
    );
  }
);
