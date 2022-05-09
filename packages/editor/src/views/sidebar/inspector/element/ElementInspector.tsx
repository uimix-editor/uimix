import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { AttributesPane } from "./AttributesPane";
import { ElementCommonPane } from "./ElementCommonPane";
import { ImgElementPane } from "./ImgElementPane";

const ElementInspectorWrap = styled.div``;

export const ElementInspector: React.FC = observer(() => {
  return (
    <ElementInspectorWrap>
      <ElementCommonPane />
      <ImgElementPane />
      <AttributesPane />
    </ElementInspectorWrap>
  );
});
