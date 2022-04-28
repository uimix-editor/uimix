import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { ElementResizeBox } from "./ElementResizeBox";

const IndicatorsWrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const IndicatorsSVG = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

export const Indicators: React.VFC<{
  className?: string;
}> = observer(function Indicators({ className }) {
  return (
    <IndicatorsWrap className={className}>
      <IndicatorsSVG>
        <ElementResizeBox />
      </IndicatorsSVG>
    </IndicatorsWrap>
  );
});
