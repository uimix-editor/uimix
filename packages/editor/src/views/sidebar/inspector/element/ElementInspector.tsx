import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { AttributesPane } from "./AttributesPane";
import { ElementCommonPane } from "./ElementCommonPane";

const ElementInspectorWrap = styled.div``;

export const ElementInspector: React.FC = observer(() => {
  return (
    <ElementInspectorWrap>
      <ElementCommonPane />
      <AttributesPane />
    </ElementInspectorWrap>
  );
});
