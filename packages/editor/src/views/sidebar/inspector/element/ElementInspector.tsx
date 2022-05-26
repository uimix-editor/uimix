import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { AttributesPane } from "./AttributesPane";
import { ElementCommonPane } from "./ElementCommonPane";
import { ImgElementPane } from "./ImgElementPane";
import { SlotElementPane } from "./SlotElementPane";

const ElementInspectorWrap = styled.div``;

export const ElementInspector: React.FC = observer(() => {
  return (
    <ElementInspectorWrap>
      <ElementCommonPane />
      <ImgElementPane />
      <SlotElementPane />
      <AttributesPane />
    </ElementInspectorWrap>
  );
});
